import {auth, db} from "../firebase.ts";
import {useList, useListVals} from "react-firebase-hooks/database";
import {ref, push} from "firebase/database";
import {Stack, TextField, Typography} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";

export default function Chatbox() {
    const [user] = useAuthState(auth);
    const [snapshots, loading, error] = useList(ref(db, 'messages'));
    const [users] = useListVals<{ username: string, online: boolean }>(ref(db, 'users'));
    const [message, setMessage] = useState('');
    const messageBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messageBoxRef.current?.children.item(messageBoxRef.current?.childNodes.length - 1)?.scrollIntoView();
    }, [snapshots]);

    function sendChat() {
        if (message.length === 0) return;

        push(ref(db, 'messages'), {
            username: user?.email,
            message,
            createdAt: new Date().toISOString(),
        });

        messageBoxRef.current?.children.item(messageBoxRef.current?.childNodes.length - 1)?.scrollIntoView();
        setMessage('');
    }

    return (
        <Stack spacing={2}>
            <Stack spacing={2} ref={messageBoxRef} height={'50vh'} sx={{
                overflowY: 'scroll',
                overflowX: 'hidden',
            }}>
                {!loading && snapshots && (
                    snapshots.map((v) => {
                        const isUserOnline = users!.find((u) => u.username === v.val().username && u.online);
                        return (
                            <Stack key={`${v.key}`} direction={'row'} spacing={2} alignItems={'center'}>
                                <Typography
                                    color={isUserOnline ? 'green' : 'red'}>{v.val().username.replaceAll('@webchat.com', '')}:</Typography>
                                <Typography>{v.val().message}</Typography>
                            </Stack>
                        )
                    })
                )}
            </Stack>
            <TextField
                label="Message"
                multiline
                rows={2}
                value={message}
                onChange={(val) => {
                    setMessage(val.target.value)
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        sendChat()
                    }
                }}
            />
        </Stack>
    )
}