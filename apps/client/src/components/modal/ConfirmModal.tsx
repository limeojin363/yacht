import styled from "@emotion/styled";

interface ConfirmModalProps {
  content: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmModal = ({ content, onCancel, onConfirm }: ConfirmModalProps) => {
  return (
    <S.Background>
      <S.ModalBody>
        <S.ModalContentArea>{content}</S.ModalContentArea>
        <S.ButtonArea>
          <S.Button theme={"SECONDARY"} onClick={onCancel}>
            취소
          </S.Button>
          <S.Button theme={"PRIMARY"} onClick={onConfirm}>
            확인
          </S.Button>
        </S.ButtonArea>
      </S.ModalBody>
    </S.Background>
  );
};

const S = {
  ModalBody: styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;

    border-radius: 4px;
    border: 1px solid black;
`,
  ModalContentArea: styled.div``,
  ButtonArea: styled.div``,
  Button: styled.button<{ theme: "PRIMARY" | "SECONDARY" }>``,
  Background: styled.div`
    background: #000000ab;
    position: fixed;
    top: 0;
    left: 0;
    height: 100dvh;
    width: 100dvw;
  `,
};

export default ConfirmModal;
