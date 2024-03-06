import React, { createContext, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import type { WAMLDocument } from "@riiid/waml";
import { WAML } from "@riiid/waml";
import type { FCWithChildren, WAMLComponentType, WAMLUserInteraction, WAMLViewerOptions } from "./types.js";
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
  'e': PointerEvent|MouseEvent,
  'currentTarget': HTMLElement,
  'callback'?: (value?:string) => void
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
    'pendingAnswer': ReturnType<typeof flattenAnswer>|null,
    'pendingClasses': string[],
    'interactionTokenIndex': Record<string, number>,
    'buttonOptionUsed': Record<string, number[]>,
    'buttonOptions': Record<number, WAML.ButtonOption>,
    'namedInteractionTokens': Record<string, InteractionToken>,
    'pairingOptionDots': Record<string, [inbound:HTMLElement|null, outbound:HTMLElement|null]>
  },
  'value': WAML.Answer|undefined,

  'checkButtonOptionUsed': (node:WAML.ButtonOption) => boolean,
  'getButtonOptionByValue': (value:string) => WAML.ButtonOption|null,
  'getComponentOptions': <T extends WAMLComponentType>(type:T) => WAMLViewerOptions[T],
  'getURL': (uri:string) => string,
  'invokeInteractionToken': (id:string) => InteractionToken,
  'logInteraction': (e:Omit<WAMLUserInteraction, 'timestamp'>) => void,
  'setDraggingObject': (value:DraggingObject|null) => void,
  'setFlattenValue': (runner:(prev:ReturnType<typeof flattenAnswer>, interactions:WAML.Interaction[]) => false|typeof prev) => void
};
type Props = {
  'document': WAMLDocument|WAML.ParserError,
  'options': WAMLViewerOptions,
  'defaultValue'?: WAML.Answer,
  'value'?: WAML.Answer,
  'onChange'?: (value:WAML.Answer) => void,
  'onInteract'?: (e:WAMLUserInteraction) => void
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
export const WAMLProvider:FCWithChildren<Props> = ({ document, options, defaultValue, value, onChange, onInteract, children }) => {
  const $renderingVariables = useRef<Context['renderingVariables']>({
    pendingAnswer: null,
    pendingClasses: [],
    interactionTokenIndex: {},
    buttonOptionUsed: {},
    buttonOptions: {},
    namedInteractionTokens: {},
    pairingOptionDots: {}
  });
  const [ uncontrolledValue, setUncontrolledValue ] = useState(defaultValue);
  const [ draggingObject, setDraggingObject ] = useState<DraggingObject|null>(null);

  const flatValue = useMemo(() => uncontrolledValue ? flattenAnswer(uncontrolledValue) : [], [ uncontrolledValue ]);
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
            const nextInput = [ ...$renderingVariables.current.pendingAnswer || flatValue ];
            nextInput[v.index] = next;
            $renderingVariables.current.pendingAnswer = nextInput;
            const nextAnswer = unflattenAnswer(nextInput);
            setUncontrolledValue(nextAnswer);
            onChange?.(nextAnswer);
          }
        );
      }
    }
    $renderingVariables.current.pendingAnswer = null;
    $renderingVariables.current.interactionTokenIndex = {};
    return R;
  }, [ document, flatValue, onChange ]);
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

  useEffect(() => {
    if(!value) return;
    setUncontrolledValue(value);
  }, [ value ]);

  const R = useMemo<Context>(() => ({
    checkButtonOptionUsed: node => {
      // 같은 value의 두 노드 중 한 노드만 답안으로 선택된 경우 먼저 등장한 노드부터 사용된 것으로 처리한다.
      const usedNodes = $renderingVariables.current.buttonOptionUsed[node.value] ||= [];
      let sequence = usedNodes.indexOf(node.id);
      if(sequence === -1) sequence = usedNodes.push(node.id) - 1;

      return node.value in buttonOptionState && buttonOptionState[node.value].length > sequence;
    },
    commonOptions: options,
    draggingObject,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    getButtonOptionByValue: value => {
      const candidates = Object.values($renderingVariables.current.buttonOptions).filter(v => v.value === value);
      if(!candidates.length) return null;
      return candidates[candidates.length - ($renderingVariables.current.buttonOptionUsed[value]?.length || 1)];
    },
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
    logInteraction: e => onInteract?.({ ...e, timestamp: Date.now() }),
    metadata: 'error' in document ? null! : document.metadata,
    pairing,
    renderingVariables: $renderingVariables.current,
    setDraggingObject,
    setFlattenValue: runner => {
      const r = runner(
        $renderingVariables.current.pendingAnswer || flatValue,
        'error' in document ? null! : document.metadata.answerFormat.interactions
      );
      if(r === false) return;
      $renderingVariables.current.pendingAnswer = r;
      const nextAnswer = unflattenAnswer(r);
      setUncontrolledValue(nextAnswer);
      onChange?.(nextAnswer);
    },
    value: uncontrolledValue
  }), [ buttonOptionState, document, draggingObject, flatValue, interactionTokens, onChange, onInteract, options, pairing, uncontrolledValue ]);

  return <context.Provider value={R}>
    {children}
  </context.Provider>;
};