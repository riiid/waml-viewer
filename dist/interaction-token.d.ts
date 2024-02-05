import { WAML } from "@riiid/waml";
export default class InteractionToken {
    #private;
    readonly input?: ReturnType<typeof flattenAnswer>[number];
    private readonly answers;
    private readonly callback?;
    private readonly index;
    private answerType;
    private ordered?;
    get correct(): boolean | undefined;
    get interactionValue(): string;
    get selected(): boolean;
    constructor(interaction: WAML.Interaction, answers: ReturnType<typeof flattenAnswer>, index: number, input?: ReturnType<typeof flattenAnswer>[number], callback?: (next: Exclude<typeof input, undefined>) => void);
    handleInteract(value: string, appendOnly?: boolean): void;
    unsetInteract(): void;
}
export declare function flattenAnswer(answer: WAML.Answer): ({
    type: "SINGLE";
    value: string[];
} | {
    type: "MULTIPLE";
    value: string[];
    ordered: boolean;
})[];
export declare function unflattenAnswer(answer: ReturnType<typeof flattenAnswer>): WAML.Answer;
