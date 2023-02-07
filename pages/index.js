import Head from "next/head";
import Message from  "../components/message";
import {useEffect, useState } from "react";
import {db} from "../utils/firebase";
import {collection, query , orderBy,onSnapshot } from "firebase/firestore";
import Link from "next/link";
export default function Home() {
//grab posts
    const[allPosts,setAllPosts] = useState([]) ;

    const getPosts = async () => {
        const collectionRef=collection(db, 'posts');
        const q = query(collectionRef, orderBy('timestamp','desc'));
        const unsubscribe= onSnapshot(q, (snapshot) =>  { 
        setAllPosts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})));
        });
        return unsubscribe;
    };

    useEffect(() => {
       getPosts();
    }, []);
  return (
    <div>
        <Head>
            <title>RealDiscuss</title>
            <meta content="width=device-width, initial-scale=1" name="viewport" />
            <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
        </Head> 
        <div className="my-12 text-lg font-medium">
            <h2> See what people are discussing </h2>
            {allPosts.map((post) => (
            <Message key={post.id}{...post}>
                <Link href={{pathname: `/${post.id}`, query:{...post}}}>
                <button>{post.comments?.length > 0 ? post.comments?.length : 0} {post.comments?.length === 1 ? comment : comments} </button>
                </Link>
            </Message>
            ))}
        </div>  
    </div>
    );
}
