import styled from "@emotion/styled";

type AlertModalProps = {
  children: React.ReactNode;
  onConfirm: () => void;
};

const AlertModal = ({ children, onConfirm }: AlertModalProps) => {
  return (
    <S.Background>
      <S.ModalBody>
        <S.ModalTextArea>{children}</S.ModalTextArea>
        <S.ButtonArea>
          <S.Button onClick={onConfirm}>확인</S.Button>
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
    padding: 16px;
    min-width: 300px;

    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
  `,
  ModalTextArea: styled.div``,
  ButtonArea: styled.div``,
  Button: styled.button``,
  Background: styled.div`
    background: #000000ab;
    position: fixed;
    top: 0;
    left: 0;
    height: 100dvh;
    width: 100dvw;
  `,
};

export default AlertModal;
