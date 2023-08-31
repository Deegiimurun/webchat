import {forwardRef, ReactElement, useState} from "react";
import {TransitionProps} from "@mui/material/transitions";
import {
    Button, Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
    Stack,
    TextField, Typography
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {useSignInWithEmailAndPassword} from "react-firebase-hooks/auth";
import {auth} from "../firebase.ts";


const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
    open: boolean,
    onClose: () => void,
}

export default function LoginForm({open, onClose}: Props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [signInWithEmailAndPassword, user, loading, error,] = useSignInWithEmailAndPassword(auth);

    function signup() {
        signInWithEmailAndPassword(`${username}@webchat.com`, password);
    }

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onClose}
        >
            <DialogTitle>Login</DialogTitle>
            <DialogContent>
                <Stack spacing={2} py={2}>
                    <TextField label="Username" variant="outlined"
                               value={username}
                               error={error !== undefined}
                               onChange={(val) => {
                                   setUsername(val.target.value)
                               }}/>
                    <TextField label="Password" variant="outlined" type="password"
                               value={password}
                               error={error !== undefined}
                               onChange={(val) => {
                                   setPassword(val.target.value)
                               }}/>
                    {error !== undefined && <Typography color='red'>{error.message}</Typography>}
                </Stack>
            </DialogContent>
            <DialogActions>
                <LoadingButton loading={loading} onClick={signup}>Sign Up</LoadingButton>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}