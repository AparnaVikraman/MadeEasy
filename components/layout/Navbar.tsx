import Link from "next/link";
import {Button} from "@/components/ui/button";
import {navLinks} from "@/data/navLinks";
import {ThemeChanger} from "@/app/Theme-changer";
import {
    ClerkProvider,
    SignInButton,
  SignedIn,
  SignedOut,
  UserButton
  } from '@clerk/nextjs'

const Navbar = () => {
    return (
        <nav className="py-4 bg-background/30 backdrop-blur-sm">
            <div className="container flex flex-row justify-between items-center">
                <Link href="/">
                    <h1 className="text-2xl">
                        Logo
                    </h1>
                </Link>
                <ul className="md:flex flex-row justify-between gap-8 hidden">
                    {navLinks.map((link) => (
                        <li key={link.title}>
                            <Link href={link.href
                            }>
                                {link.title}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="flex flex-row justify-end space-x-2">
                    <ThemeChanger/>
                            <SignedOut>
                                <SignInButton>
                                    <button>Sign In</button>
                                </SignInButton>
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;