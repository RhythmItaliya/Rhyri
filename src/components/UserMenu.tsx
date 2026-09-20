import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "./ui/DropdownMenu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Button } from "./ui/Button";
import { catchError } from "../lib/utils";

export function UserMenu() {
  const { currentUser, signOutCurrentUser } = useAuth();
  const navigate = useNavigate();

  const initial = currentUser?.displayName?.charAt(0) || "P";

  const handleSignOut = async () => {
    try {
      await signOutCurrentUser();
    } catch (error) {
      catchError(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {currentUser?.photoURL ? (
              <AvatarImage src={currentUser.photoURL} alt="profile" />
            ) : (
              <AvatarFallback>
                <p className="sr-only">Profile</p>
                {initial}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel className="text-muted">
          {currentUser?.email}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => navigate("/backup")}>
          Backup &amp; Data
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={handleSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
