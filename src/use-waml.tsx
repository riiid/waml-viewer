import { createContext, useContext, useId, useMemo, useRef, useState } from "react";
import type { WAMLDocument } from "@riiid/waml";
import { WAML } from "@riiid/waml";
import type { FCWithChildren, WAMLComponentType, WAMLViewerOptions } from "./types";
import InteractionToken, { flattenAnswer, unflattenAnswer } from "./interaction-token";

type SplittedFormOf<T extends string> = T extends `${infer A}${infer B}`
  ? B extends ""
  ? [A]
  : [A, ...SplittedFormOf<B>]
  : []
;
type FirstLetterOf<T extends string> = SplittedFormOf<T>[0];

type Context = {
  'metadata': WAML.Metadata,
  'commonOptions': {
    [key in keyof WAMLViewerOptions as FirstLetterOf<key> extends Lowercase<FirstLetterOf<key>> ? key : never]: WAMLViewerOptions[key]
  },
  'getComponentOptions': <T extends WAMLComponentType>(type:T) => WAMLViewerOptions[T],
  'getURL': (uri:string) => string,
  'value': WAML.Answer|undefined,
  'invokeInteractionToken': (id:string) => InteractionToken,
  'interactionToken': InteractionToken,

  'renderingVariables': {
    'pendingClasses': string[],
    'interactionTokenIndex': Record<string, number>
  }
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
    interactionTokenIndex: {}
  });
  const [ value, setValue ] = useState<WAML.Answer>();

  const flatValue = useMemo(() => value ? flattenAnswer(value) : [], [ value ]);
  const interactionTokens = useMemo(() => {
    if('error' in document) return [];
    const { metadata } = document;
    const R:InteractionToken[] = [];
    const flatAnswers = metadata?.answers.map(flattenAnswer);

    for(let i = 0; i < metadata.answerFormat.interactions.length; i++){
      const v = metadata.answerFormat.interactions[i];

      switch(v.type){
        case WAML.InteractionType.CHOICE_OPTION:
        case WAML.InteractionType.BUTTON_OPTION: {
          for(let j = 0; j < v.values.length; j++) R.push(newToken(j));
          break;
        }
        default:
          R.push(newToken());
      }
      function newToken(index:number = 0):InteractionToken{
        return new InteractionToken(
          v,
          flatAnswers.map(w => w[i]),
          index,
          flatValue[i],
          next => {
            const nextInput = [ ...flatValue ];

            nextInput[i] = next;
            setValue(unflattenAnswer(nextInput));
          }
        );
      }
    }
    $renderingVariables.current.interactionTokenIndex = {};
    return R;
  }, [ document, flatValue ]);

  const R = useMemo<Context>(() => ({
    metadata: 'error' in document ? null! : document.metadata,
    commonOptions: {
      noDefaultClassName: options.noDefaultClassName || false
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
    value,
    renderingVariables: $renderingVariables.current
  }), [ document, interactionTokens, options, value ]);

  return <context.Provider value={R}>
    {children}
  </context.Provider>;
};