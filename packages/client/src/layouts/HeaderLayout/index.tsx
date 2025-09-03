import styled from "@emotion/styled"

interface HeaderLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const HeaderLayout = ({children}: HeaderLayoutProps) => {
    return <S.Root>{children}</S.Root>;
};

const S = {
    Root: styled.div`
        /* FILL HERE */
    `,
}

export default HeaderLayout;
