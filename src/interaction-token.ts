/* eslint-disable @typescript-eslint/no-parameter-properties */
import { WAML } from "@riiid/waml";

const enum InteractionAnswerType{
  SINGLE,
  MULTIPLE
}

export default class InteractionToken{
  public readonly input?:ReturnType<typeof flattenAnswer>[number];
  public readonly seq:number;
  private readonly answers:ReturnType<typeof flattenAnswer>;
  private readonly callback?:(next:ReturnType<typeof flattenAnswer>[number]) => void;
  private readonly index:number;
  #interactionValue?:string;
  private answerType:InteractionAnswerType;
  private ordered?:boolean;

  public get correct():boolean|undefined{
    if(!this.answers.length) return undefined;
    switch(this.answerType){
      case InteractionAnswerType.SINGLE:
        return this.answers.some(v => v.value[0] === this.interactionValue);
      case InteractionAnswerType.MULTIPLE:
        if(this.ordered){
          return this.answers.some(v => v.value[this.index] === this.interactionValue);
        }
        return this.answers.some(v => v.value.includes(this.interactionValue));
      default:
        throw Error(`Unhandled answerType: ${this.answerType}`);
    }
  }
  public get interactionValue():string{
    if(this.#interactionValue === undefined){
      // NOTE 주관식이나 버튼인 경우 여기로 옴
      return this.input?.value.join(' ') || "";
    }
    return this.#interactionValue;
  }
  public get selected():boolean{
    return this.input?.value.includes(this.interactionValue) || false;
  }

  constructor(
    interaction:WAML.Interaction,
    answers:ReturnType<typeof flattenAnswer>,
    index:number,
    input?:ReturnType<typeof flattenAnswer>[number],
    callback?:(next:Exclude<typeof input, undefined>) => void
  ){
    this.seq = interaction.index;
    this.answers = answers;
    this.index = index;
    this.input = input;
    this.callback = callback;
    switch(interaction.type){
      case WAML.InteractionType.CHOICE_OPTION:
        if(interaction.multipleness){
          this.answerType = InteractionAnswerType.MULTIPLE;
          this.ordered = interaction.multipleness === "ordered";
        }else{
          this.answerType = InteractionAnswerType.SINGLE;
        }
        this.#interactionValue = interaction.values[index];
        break;
      case WAML.InteractionType.BUTTON_OPTION:
        if(interaction.multipleness){
          this.answerType = InteractionAnswerType.MULTIPLE;
          this.ordered = interaction.multipleness === "ordered";
        }else{
          this.answerType = InteractionAnswerType.SINGLE;
        }
        break;
      case WAML.InteractionType.PAIRING_NET:
        throw Error("InteractionToken does not support PAIRING_NET");
      default:
        this.answerType = InteractionAnswerType.SINGLE;
    }
  }

  public handleInteract(value:string, appendOnly?:boolean):void{
    switch(this.answerType){
      case InteractionAnswerType.SINGLE:
        this.callback?.({ type: "SINGLE", value: [ value ] });
        break;
      case InteractionAnswerType.MULTIPLE: {
        const next = [ ...this.input?.value || [] ];
        if(appendOnly){
          next.push(value);
        }else{
          const index = next.indexOf(value);

          if(index === -1) next.push(value);
          else next.splice(index, 1);
        }
        this.callback?.({ type: "MULTIPLE", value: next, ordered: this.ordered! });
      } break;
      default:
        throw Error(`Unhandled answerType: ${this.answerType}`);
    }
  }
  public unsetInteract():void{
    this.callback?.(null!);
  }
}
export function flattenAnswer(answer:WAML.Answer){
  switch(answer.type){
    case "SINGLE":
    case "MULTIPLE":
      return [ answer ];
    case "COMBINED":
      return answer.children;
  }
}
export function unflattenAnswer(answer:ReturnType<typeof flattenAnswer>):WAML.Answer{
  for(const v of answer){
    if(v?.type === "MULTIPLE" && !v.ordered){
      v.value.sort((a, b) => a.localeCompare(b));
    }
  }
  if(answer.length > 1){
    return { type: "COMBINED", children: answer };
  }
  return answer[0];
}