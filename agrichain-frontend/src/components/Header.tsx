import { User } from "../types"

const Header = ({user, altHeader, text, altText}: {user: User | null, altHeader: string, text: string, altText: string}) => {
    return (
        <header className="mb-8">
            <h1 className="text-3xl font-semibold mb-2">
                {user ? `${user.name}'s Dashboard` : `${altHeader}`}
            </h1>
            <p className="text-neutral-600">
                {user ? `Welcome back, ${user.name}! ${text}` : `${altText}`}
            </p>
            {user && (
                <div className="mt-2 text-sm text-neutral-500">
                    Logged in as {user.role} ({user.email || 'no email'})
                </div>
            )}
        </header>
    );
};

export default Header;