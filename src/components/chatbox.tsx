import {auth, db, firestore} from "../firebase.ts";
import {useListVals} from "react-firebase-hooks/database";
import {ref} from "firebase/database";
import {Button, Stack, TextField, Typography} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {useCollection} from "react-firebase-hooks/firestore";
import {collection, addDoc, query, orderBy, limitToLast} from 'firebase/firestore';
import InfiniteScroll from "react-infinite-scroll-component";

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
    const [items, setItems] = useState(Array.from({ length: 100 }));
    const messageBoxRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        console.log(snapshot?.docs)
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

    function fetchMoreData() {
        setItems(items.concat(Array.from({ length: 100 })));
    }

    return (
        <Stack spacing={2}
               style={{
                   height: '50vh',
                   overflow: 'auto',
                   display: 'flex',
               }}>
            <div
                id="scrollableDiv"
                style={{
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                }}
            >
                <InfiniteScroll
                    dataLength={snapshot?.size || 0}
                    next={() => {setPage(prevState => prevState + 20)}}
                    style={{ display: 'flex', flexDirection: 'column-reverse' }}
                    inverse={true} //
                    hasMore={true}
                    loader={<h4>Loading...</h4>}
                    scrollableTarget="scrollableDiv"
                >
                    {!loading && snapshot && (
                        snapshot.docs.reverse().map((v) => {
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
                </InfiniteScroll>
            </div>
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