/* eslint-disable @typescript-eslint/no-parameter-properties */
import { WAML } from "@riiid/waml";

export default class InteractionToken{
  public readonly input?:ReturnType<typeof flattenAnswer>[number];
  private readonly answers:ReturnType<typeof flattenAnswer>;
  private readonly callback?:(next:ReturnType<typeof flattenAnswer>[number]) => void;
  private readonly index:number;
  #interactionValue?:string;
  private answerType:Exclude<WAML.Answer['type'], 'COMBINED'>;
  private ordered?:boolean;

  public get correct():boolean|undefined{
    if(!this.answers.length) return undefined;
    switch(this.answerType){
      case "SINGLE":
        return this.answers.some(v => v.value[0] === this.interactionValue);
      case "MULTIPLE":
        if(this.ordered){
          return this.answers.some(v => v.value[this.index] === this.interactionValue);
        }
        return this.answers.some(v => v.value.includes(this.interactionValue));
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
    this.answers = answers;
    this.index = index;
    this.input = input;
    this.callback = callback;
    switch(interaction.type){
      case WAML.InteractionType.CHOICE_OPTION:
        if(interaction.multipleness){
          this.answerType = "MULTIPLE";
          this.ordered = interaction.multipleness === "ordered";
        }else{
          this.answerType = "SINGLE";
        }
        this.#interactionValue = interaction.values[index];
        break;
      case WAML.InteractionType.BUTTON_OPTION:
        if(interaction.multipleness){
          this.answerType = "MULTIPLE";
          this.ordered = interaction.multipleness === "ordered";
        }else{
          this.answerType = "SINGLE";
        }
        break;
      default:
        this.answerType = "SINGLE";
    }
  }

  public getAnswerText():string{
    return this.answers.map(v => v.value.join(', ')).join(', ');
  }
  public handleInteract(value:string):void{
    switch(this.answerType){
      case "SINGLE":
        this.callback?.({ type: "SINGLE", value: [ value ] });
        break;
      case "MULTIPLE": {
        const next = [ ...this.input?.value || [] ];
        const index = next.indexOf(value);

        if(index === -1) next.push(value);
        else next.splice(index, 1);
        this.callback?.({ type: "MULTIPLE", value: next, ordered: this.ordered! });
        break;
      }
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
  if(answer.length > 1){
    return { type: "COMBINED", children: answer };
  }
  return answer[0];
}