import React, { createContext, useContext, useId, useMemo, useRef, useState } from "react";
import type { WAMLDocument } from "@riiid/waml";
import { WAML } from "@riiid/waml";
import type { FCWithChildren, WAMLComponentType, WAMLViewerOptions } from "./types.js";
import InteractionToken, { flattenAnswer, unflattenAnswer } from "./interaction-token.js";

type SplittedFormOf<T extends string> = T extends `${infer A}${infer B}`
  ? B extends ""
  ? [A]
  : [A, ...SplittedFormOf<B>]
  : []
;
type FirstLetterOf<T extends string> = SplittedFormOf<T>[0];
type DraggingObject = {
  'displayName': WAMLComponentType,
  'node': WAML.ButtonOption|WAML.PairingOption,
  '$target': HTMLElement
};

type Context = {
  'commonOptions': {
    [key in keyof WAMLViewerOptions as FirstLetterOf<key> extends Lowercase<FirstLetterOf<key>> ? key : never]: WAMLViewerOptions[key]
  },
  'draggingObject': DraggingObject|null,
  'interactionToken': InteractionToken,
  'metadata': WAML.Metadata,
  'pairing': {
    'pairedVertices': Record<string, Array<{netIndex: number}&({from: string}|{to: string})>>,
    'getDotRefs': (node:WAML.PairingOption) => {
      'refInbound': ($:HTMLElement|null) => void,
      'refOutbound': ($:HTMLElement|null) => void
    },
    'getNetIndexByEdge': (from:string, to:string) => [number, string]
  },
  'renderingVariables': {
    'pendingClasses': string[],
    'interactionTokenIndex': Record<string, number>,
    'buttonOptionUsed': Record<string, number[]>,
    'namedInteractionTokens': Record<string, InteractionToken>,
    'pairingOptionDots': Record<string, [inbound:HTMLElement|null, outbound:HTMLElement|null]>
  },
  'value': WAML.Answer|undefined,

  'checkButtonOptionUsed': (node:WAML.ButtonOption) => boolean,
  'getComponentOptions': <T extends WAMLComponentType>(type:T) => WAMLViewerOptions[T],
  'getURL': (uri:string) => string,
  'invokeInteractionToken': (id:string) => InteractionToken,
  'setDraggingObject': (value:DraggingObject|null) => void,
  'setFlattenValue': (runner:(prev:ReturnType<typeof flattenAnswer>, interactions:WAML.Interaction[]) => false|typeof prev) => void
};
type Props = {
  'document': WAMLDocument|WAML.ParserError,
  'options': WAMLViewerOptions
};

const context = createContext<Context>(null!);
const useWAML = (invokingInteractionToken?:boolean) => {
  const id = useId();
  const R = useContext(context);

  if(invokingInteractionToken){
    R.interactionToken = R.invokeInteractionToken(id);
  }
  return R;
};

export default useWAML;
export const WAMLProvider:FCWithChildren<Props> = ({ document, options, children }) => {
  const $renderingVariables = useRef<Context['renderingVariables']>({
    pendingClasses: [],
    interactionTokenIndex: {},
    buttonOptionUsed: {},
    namedInteractionTokens: {},
    pairingOptionDots: {}
  });
  const [ value, setValue ] = useState<WAML.Answer>();
  const [ draggingObject, setDraggingObject ] = useState<DraggingObject|null>(null);

  const flatValue = useMemo(() => value ? flattenAnswer(value) : [], [ value ]);
  const buttonOptionState = useMemo(() => {
    if('error' in document) return {};
    const R:Record<string, number[]> = {};

    for(const v of document.metadata.answerFormat.interactions){
      if(v.type !== WAML.InteractionType.BUTTON_OPTION) continue;
      for(const w of flatValue[v.index]?.value || []){
        R[w] ??= [];
        R[w].push(v.index);
      }
    }
    return R;
  }, [ document, flatValue ]);
  const interactionTokens = useMemo(() => {
    if('error' in document) return [];
    const { metadata } = document;
    const R:InteractionToken[] = [];
    const flatAnswers = metadata?.answers.map(flattenAnswer);
    for(const v of metadata.answerFormat.interactions){
      switch(v.type){
        case WAML.InteractionType.CHOICE_OPTION:
          for(let j = 0; j < v.values.length; j++) R.push(newToken(j));
          break;
        case WAML.InteractionType.PAIRING_NET:
          continue;
        default:
          R.push(newToken());
      }
      function newToken(index:number = 0):InteractionToken{
        return new InteractionToken(
          v,
          flatAnswers.map(w => w[v.index]),
          index,
          flatValue[v.index],
          next => {
            const nextInput = [ ...flatValue ];
            nextInput[v.index] = next;
            setValue(unflattenAnswer(nextInput));
          }
        );
      }
    }
    $renderingVariables.current.interactionTokenIndex = {};
    return R;
  }, [ document, flatValue ]);
  const pairing = useMemo<Context['pairing']>(() => {
    if('error' in document) return {
      pairedVertices: {},
      getDotRefs: () => ({ refInbound: null!, refOutbound: null! }),
      getNetIndexByEdge: () => [ -1, null! ]
    };
    const { metadata } = document;
    const pairedVertices:Context['pairing']['pairedVertices'] = {};

    for(const v of metadata.answerFormat.interactions){
      if(v.type !== WAML.InteractionType.PAIRING_NET) continue;
      const item = flatValue[v.index];
      if(!item) continue;
      for(const w of item.value){
        const [ from, to ] = w.split('→');
        pairedVertices[from] ||= [];
        pairedVertices[to] ||= [];
        pairedVertices[from].push({ netIndex: v.index, to });
        pairedVertices[to].push({ netIndex: v.index, from });
      }
    }
    return {
      pairedVertices,
      getDotRefs: node => {
        $renderingVariables.current.pairingOptionDots[node.cell.value] ??= [ null, null ];

        return {
          refInbound: $ => {
            $renderingVariables.current.pairingOptionDots[node.cell.value][0] = $;
          },
          refOutbound: $ => {
            $renderingVariables.current.pairingOptionDots[node.cell.value][1] = $;
          }
        };
      },
      getNetIndexByEdge: (from, to) => {
        let reversed = false;
        const index = metadata.answerFormat.interactions.findIndex(v => {
          if(v.type !== WAML.InteractionType.PAIRING_NET) return false;
          if(v.fromValues.includes(from)){
            reversed = false;
            return v.toValues.includes(to);
          }
          if(v.toValues.includes(from)){
            reversed = true;
            return v.fromValues.includes(to);
          }
          return false;
        });
        return [ index, reversed ? `${to}→${from}` : `${from}→${to}` ];
      }
    };
  }, [ document, flatValue ]);

  const R = useMemo<Context>(() => ({
    checkButtonOptionUsed: node => {
      // 같은 value의 두 노드 중 한 노드만 답안으로 선택된 경우 먼저 등장한 노드부터 사용된 것으로 처리한다.
      const usedNodes = $renderingVariables.current.buttonOptionUsed[node.value] ||= [];
      let sequence = usedNodes.indexOf(node.id);
      if(sequence === -1) sequence = usedNodes.push(node.id) - 1;

      return node.value in buttonOptionState && buttonOptionState[node.value].length > sequence;
    },
    commonOptions: {
      noDefaultClassName: options.noDefaultClassName || false
    },
    draggingObject,
    getComponentOptions: type => options[type],
    getURL: options.uriResolver || (uri => uri),
    interactionToken: null!,
    invokeInteractionToken: id => {
      let index = $renderingVariables.current.interactionTokenIndex[id];
      if(index === undefined){
        index = Object.keys($renderingVariables.current.interactionTokenIndex).length;
        $renderingVariables.current.interactionTokenIndex[id] = index;
      }
      const r = interactionTokens[index];
      if(!r){
        throw Error(`Unexpected interaction token index: ${index}`);
      }
      return r;
    },
    metadata: 'error' in document ? null! : document.metadata,
    pairing,
    renderingVariables: $renderingVariables.current,
    setDraggingObject,
    setFlattenValue: runner => {
      const r = runner(
        flatValue,
        'error' in document ? null! : document.metadata.answerFormat.interactions
      );
      if(r === false) return;
      setValue(unflattenAnswer(r));
    },
    value
  }), [ buttonOptionState, document, draggingObject, flatValue, interactionTokens, options, pairing, value ]);

  return <context.Provider value={R}>
    {children}
  </context.Provider>;
};