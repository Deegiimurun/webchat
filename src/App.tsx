import {auth, db} from "./firebase.ts";
import {useAuthState, useSignOut} from "react-firebase-hooks/auth";
import {Button, Stack} from "@mui/material";
import {useEffect, useState} from "react";
import LoginForm from "./components/login-form.tsx";
import SignupForm from "./components/signup-form.tsx";
import Chatbox from "./components/chatbox.tsx";
import {ref, set, onDisconnect, push} from "firebase/database";

function App() {
    const [user, loading] = useAuthState(auth, {
        onUserChanged: async () => {
            setShowSignupForm(false);
            setShowLoginForm(false);
        }
    });
    const [signOut] = useSignOut(auth);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showSignupForm, setShowSignupForm] = useState(false);

    const isAuthenticated = !loading && user !== null;

    useEffect(() => {
        if (isAuthenticated) {
            set(ref(db, `users/${user?.uid}`), {
                username: user?.email,
                online: true
            });

            onDisconnect(ref(db, `users/${user?.uid}`)).set({
                username: user?.email,
                online: false
            });
        }
    },[isAuthenticated]);


    if (showLoginForm) {
        return <LoginForm open={showLoginForm} onClose={() => setShowLoginForm(false)}/>;
    }

    if (showSignupForm) {
        return <SignupForm open={showSignupForm} onClose={() => setShowSignupForm(false)}/>;
    }


    if (loading) {
        return <></>;
    }

    return (
        <Stack spacing={2} p={20} width={'30vw'} mx={'auto'}>
            {isAuthenticated ?
                <Stack>
                    <Chatbox />
                    <Button variant="contained" onClick={signOut}>Logout</Button>
                </Stack>:
                <Stack>
                    <Button variant="contained" onClick={() => setShowSignupForm(true)}>Signup</Button>
                    <Button variant="contained" onClick={() => setShowLoginForm(true)}>Login</Button>
                </Stack>
            }
        </Stack>
    )
}

export default App
