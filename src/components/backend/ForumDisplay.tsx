import { useEffect, useState } from 'react';
import { Forum, Post } from '../../xplat/types';
import PostDisplay from './PostDisplay';

const ForumDisplay = ({ forum }: { forum: Forum }) => {
    const [posts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const postCursor = forum.getPostsCursor();
            const tempPosts: Post[] = [];
            while (await postCursor.hasNext()) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                tempPosts.push((await postCursor.pollNext())!);
            }
        };
        fetchPosts();
    }, [forum]);

    return (
        <ul className="forumElement">
            {posts.map(function (d, idx) {
                return (
                    <li key={idx}>
                        <PostDisplay post={d} />
                    </li>
                );
            })}
        </ul>
    );
};

export default ForumDisplay;
