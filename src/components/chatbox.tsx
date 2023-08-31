import {auth, db, firestore} from "../firebase.ts";
import {useListVals} from "react-firebase-hooks/database";
import {ref} from "firebase/database";
import {Button, Stack, TextField, Typography} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {useCollection} from "react-firebase-hooks/firestore";
import {collection, addDoc, query, orderBy, limitToLast} from 'firebase/firestore';

export default function Chatbox() {
    const [page, setPage] = useState(20);
    const [user] = useAuthState(auth);
    const [snapshot, loading] = useCollection(
        query(
            collection(firestore, 'messages'),
            orderBy("createdAt", "asc"),
            limitToLast(page),
        ),
    );
    const [users] = useListVals<{ username: string, online: boolean }>(ref(db, 'users'));
    const [message, setMessage] = useState('');
    const messageBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messageBoxRef.current?.children.item(messageBoxRef.current?.childNodes.length - 1)?.scrollIntoView();
    }, [snapshot]);

    function sendChat() {
        if (message.length === 0) return;

        addDoc(collection(firestore, 'messages'), {
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
                {!loading && snapshot && (
                    snapshot.docs.map((v) => {
                        const isUserOnline = users!.find((u) => u.username === v.data().username && u.online);
                        return (
                            <Stack key={`${v.id}`} direction={'row'} spacing={2} alignItems={'center'}>
                                <Typography
                                    color={isUserOnline ? 'green' : 'red'}>{v.data().username.replaceAll('@webchat.com', '')}:</Typography>
                                <Typography>{v.data().message}</Typography>
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