import React, { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import type { WAMLDocument } from "@riiid/waml";
import { WAML, hasKind } from "@riiid/waml";
import type { FCWithChildren, WAMLAction, WAMLComponentType, WAMLUserInteraction, WAMLViewerOptions } from "./types.js";
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
  'callback'?: (token:InteractionToken) => void
};
type KnobProperty = {
  'enabled': boolean,
  'activated': boolean,
  'contentOverride'?: string
};

type Context = {
  'commonOptions': {
    [key in keyof WAMLViewerOptions as FirstLetterOf<key> extends Lowercase<FirstLetterOf<key>> ? key : never]: WAMLViewerOptions[key]
  },
  'draggingObject': DraggingObject|null,
  'interactionToken': InteractionToken,
  'knobProperties': Record<number, KnobProperty>,
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
  'getButtonOptionByValue': (value:string, index:number) => WAML.ButtonOption|null,
  'getComponentOptions': <T extends WAMLComponentType>(type:T) => WAMLViewerOptions[T],
  'getKnobProperty': (index:number) => KnobProperty,
  'getURL': (uri:string) => string,
  'handleKnobClick': (index:number) => void,
  'invokeInteractionToken': (id:string) => InteractionToken,
  'logInteraction': (e:WAMLUserInteraction, debounceable?:boolean) => void,
  'setDraggingObject': (value:DraggingObject|null) => void,
  'setFlattenValue': (runner:(prev:ReturnType<typeof flattenAnswer>, interactions:WAML.Interaction[]) => false|typeof prev) => void
};
type Props = {
  'document': WAMLDocument|WAML.ParserError,
  'options': WAMLViewerOptions,
  'defaultValue'?: WAML.Answer,
  'value'?: WAML.Answer,
  'onChange'?: (value:WAML.Answer) => void,
  'onInteract'?: (e:WAMLUserInteraction) => void,
  'onKnobAction'?: (e:WAMLAction) => void
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
const debouncingInterval = 500;

export default useWAML;
export const WAMLProvider:FCWithChildren<Props> = ({ document, options, defaultValue, value, onChange, onInteract, onKnobAction, children }) => {
  const $renderingVariables = useRef<Context['renderingVariables']>({
    pendingAnswer: null,
    pendingClasses: [],
    interactionTokenIndex: {},
    buttonOptionUsed: {},
    buttonOptions: {},
    namedInteractionTokens: {},
    pairingOptionDots: {}
  });
  const $debouncedInteractions = useRef<Record<string, WAMLUserInteraction>>({});
  const [ uncontrolledValue, setUncontrolledValue ] = useState(defaultValue);
  const [ draggingObject, setDraggingObject ] = useState<DraggingObject|null>(null);
  const [ knobProperties, setKnobProperties ] = useState<Record<number, KnobProperty>>({});

  const flatValue = useMemo(() => uncontrolledValue ? flattenAnswer(uncontrolledValue) : [], [ uncontrolledValue ]);
  const buttonOptionState = useMemo(() => {
    if('error' in document) return {};
    const R:Record<string, number[]> = {};

    for(const v of document.metadata.answerFormat.interactions){
      if(v.type !== WAML.InteractionType.BUTTON_OPTION) continue;
      for(const w of flatValue[v.index]?.value || []){
        const key = `${v.group},${w}`;
        R[key] ??= [];
        R[key].push(v.index);
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
  const actionScripts = useMemo(() => {
    if('error' in document) return {};
    const R:Record<string, WAML.ActionDefinition[]> = {};

    for(const v of document.raw){
      if(hasKind(v, 'XMLElement') && v.tag === "action"){
        R[v.index] ??= [];
        R[v.index].push(...v.content);
      }
    }
    return R;
  }, [ document ]);

  const executeActionScript = useCallback((index:number, script:WAML.ActionDefinition) => {
    for(const v of script.actions){
      switch(v.command){
        case "set":
          setKnobProperties(prev => {
            const target = v.index ?? index;
            const next = { ...prev };

            switch(v.value){
              case "activated": next[target].activated = true; break;
              case "inactivated": next[target].activated = false; break;
              case "enabled": next[target].enabled = true; break;
              case "disabled": next[target].enabled = false; break;
              default: throw Error(`Unhandled set value: ${JSON.stringify(v)}`);
            }
            return next;
          });
          break;
        case "replace":
          setKnobProperties(prev => {
            const next = { ...prev };
            next[index].contentOverride = v.value;
            return next;
          });
          break;
        default: onKnobAction?.(v);
      }
    }
  }, [ onKnobAction ]);

  useEffect(() => {
    if(!value) return;
    setUncontrolledValue(value);
  }, [ value ]);
  useEffect(() => {
    const onLoadScripts:Array<() => void> = [];

    setKnobProperties(() => {
      const R:typeof knobProperties = {};

      for(const [ k, v ] of Object.entries(actionScripts)){
        const index = parseInt(k);
        R[index] = {
          enabled: true,
          activated: false
        };
        for(const w of v){
          if(w.condition.value === "onLoad"){
            onLoadScripts.push(() => executeActionScript(index, w));
          }
        }
      }
      return R;
    });
    for(const v of onLoadScripts){
      v();
    }
  }, [ actionScripts, executeActionScript ]);

  const R = useMemo<Context>(() => ({
    checkButtonOptionUsed: node => node.group.some(v => {
      const key = `${v},${node.value}`;

      // 같은 value의 두 노드 중 한 노드만 답안으로 선택된 경우 먼저 등장한 노드부터 사용된 것으로 처리한다.
      const usedNodes = $renderingVariables.current.buttonOptionUsed[key] ||= [];
      let sequence = usedNodes.indexOf(node.id);
      if(sequence === -1) sequence = usedNodes.push(node.id) - 1;

      return key in buttonOptionState && buttonOptionState[key].length > sequence;
    }),
    commonOptions: options,
    draggingObject,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    getButtonOptionByValue: (value, index) => {
      if('error' in document) return null;
      const interaction = document.metadata.answerFormat.interactions[index];
      if(interaction.type !== WAML.InteractionType.BUTTON_OPTION) throw Error(`Unexpected interaction: ${JSON.stringify(interaction)}`);
      const candidates = Object.values($renderingVariables.current.buttonOptions).filter(v => v.value === value);
      if(!candidates.length) return null;
      return candidates[candidates.length - ($renderingVariables.current.buttonOptionUsed[`${interaction.group},${value}`]?.length || 1)];
    },
    getComponentOptions: type => options[type],
    getKnobProperty: index => knobProperties[index] || { activated: false, enabled: true },
    getURL: options.uriResolver || (uri => uri),
    handleKnobClick: (index:number) => {
      for(const v of actionScripts[index] || []){
        if(v.condition.value === "onClick"){
          executeActionScript(index, v);
        }
      }
    },
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
    knobProperties,
    logInteraction: (e, debounceable) => {
      const now = Date.now();

      e.timestamp ??= now;
      if(debounceable){
        const debounced = e.type in $debouncedInteractions.current;

        $debouncedInteractions.current[e.type] = e;
        if(!debounced) window.setTimeout(() => {
          onInteract?.($debouncedInteractions.current[e.type]);
          delete $debouncedInteractions.current[e.type];
        }, debouncingInterval);
        return;
      }
      onInteract?.(e);
    },
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
  }), [ actionScripts, buttonOptionState, document, draggingObject, executeActionScript, flatValue, interactionTokens, knobProperties, onChange, onInteract, options, pairing, uncontrolledValue ]);

  return <context.Provider value={R}>
    {children}
  </context.Provider>;
};