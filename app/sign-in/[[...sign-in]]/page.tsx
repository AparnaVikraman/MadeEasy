'use client';
import { SignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from '@clerk/themes';

export default function Page() {
    const { resolvedTheme } = useTheme();
    return (
        <div className="flex flex-col justify-center self-center content-center items-center gap-10">
            <SignIn appearance={{
                baseTheme: resolvedTheme === "dark" ? dark : undefined,
            }}/>
        </div>
      
      );
}