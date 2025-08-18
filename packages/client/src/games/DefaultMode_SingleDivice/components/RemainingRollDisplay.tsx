import styled from "@emotion/styled";
import { remainingRollAtom } from "../stores/remainigRoll";
import { useAtomValue } from "jotai";

const RemainingRollDisplay = () => {
    const remainingRollData = useAtomValue(remainingRollAtom);

    return <S.Root>Remaining Rolls: {remainingRollData}</S.Root>;
}

export default RemainingRollDisplay;

const S = {
    Root: styled.div`
        padding: 12px 16px;
        background-color: #f8f9fa;
        color: #212529;
        border: 1px solid #dee2e6;
        border-radius: 4px;
    `
}
