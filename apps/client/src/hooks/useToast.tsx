import styled from "@emotion/styled";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { createPortal } from "react-dom";

const DURATION = 3000;

const messageAtom = atom("");
const visibleAtom = atom(false);

const useToast = () => {
  const [message, setMessage] = useAtom(messageAtom);
  const [visible, setVisible] = useAtom(visibleAtom);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (visible) {
      timer = setTimeout(() => {
        setVisible(false);
      }, DURATION);
    }

    return () => clearTimeout(timer);
  }, [visible, setVisible]);

  const triggerToast = (message: string) => {
    setMessage(message);

    if (!visible) setVisible(true);
    else {
      setVisible(false);
      // avoid batching
      setTimeout(() => setVisible(true), 100);
    }
  };

  const ToastComponent = () =>
    createPortal(
      visible && <S.ToastWrapper>{message}</S.ToastWrapper>,
      document.getElementById("toast")!
    );

  return { ToastComponent, triggerToast };
};

export default useToast;

const S = {
  ToastWrapper: styled.div`
    position: fixed;
    left: 0;
    bottom: 60px;
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 1000;
    pointer-events: none;

    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 12px 24px;
    
    animation: toastAnimation 3s ease forwards;
    @keyframes toastAnimation {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      50% {
        opacity: 1;
        transform: translateY(0);
      }
      100% {
        opacity: 0;
        transform: translateY(20px);
      }
    }
  `,
};
