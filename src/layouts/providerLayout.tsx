"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import GlobalModal from "@/components/common/GlobalModal";

type ProviderLayoutProps = {
    children: ReactNode;
};

export default function ProviderLayout({ children }: ProviderLayoutProps) {
    return <Provider store={store}>
        {children}
        <GlobalModal />
    </Provider>;
}