import { useEffect, useState } from 'react';
import { Forum, Post } from '../../xplat/types/types';
import PostDisplay from './PostDisplay';

const ForumDisplay = ({forum}: {forum: Forum}) => {
    const [posts, setPosts] = useState<Post[]>([]);
    
    useEffect(() => {
        const cursor = forum.getPostsCursor();
        cursor.________getAll_CLOWNTOWN_LOTS_OF_READS().then(
            (res => setPosts(res.filter((x) => x !== undefined) as Post[])));
    }, [forum]);

    return (
        <ul className="forumElement">
            {posts.map(function(d, idx){
                return (
                    <li key={idx}>
                        <PostDisplay post={d}/>      
                    </li>);
            })}
        </ul>
    );
};

export default ForumDisplay;