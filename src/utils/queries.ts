import { getActiveRoutesCursor, getArchivedRoutesCursor, getUserById } from '../xplat/api';
import { getRouteById } from '../xplat/api/route';
import {
  Comment,
  Forum,
  Post,
  QueryCursor,
  Route,
  RouteStatus,
  RouteType,
  Send,
  User
} from '../xplat/types';
import { UserStatus } from '../xplat/types/common';
import { INITIAL_CURSOR_SIZE } from './constants';

// TODO: delete this file

type FetchedUser = {
    username: string;
    displayName: string;
    bio: string;
    status: UserStatus;
    avatarUrl: string;
    sends: Send[];
    totalPostSizeInBytes: number;
    totalSends: Map<RouteType, number>;
    bestSends: Map<RouteType, number>;
    userObject: User;
};
export const buildUserFetcher = (user: User) => {
  return async (): Promise<FetchedUser> => {
    await user.getData();
    return {
      username: await user.getUsername(),
      displayName: await user.getDisplayName(),
      bio: await user.getBio(),
      status: await user.getStatus(),
      avatarUrl: await user.getAvatarUrl(),
      
      totalPostSizeInBytes: await user.getTotalPostSizeInBytes(),
      userObject: user,
    } as FetchedUser;
  };
};
export type FetchedUserProfile = {
    username: string;
    displayName: string;
    bio: string;
    status: UserStatus;
    numFollowing: number;
    numFollowers: number;
    avatarUrl: string;
    userObject: User;
    hasMorePosts: boolean;
    postCursor: QueryCursor<Post>;
    posts: Post[];
};
export const buildUserByIDFetcher = (uid: string) => {
  return async (): Promise<FetchedUserProfile> => {
    const user = getUserById(uid);
    try {
      await user.getData();
    } catch (e) {
      return Promise.reject('Invalid user ID');
    }
    const postCursor = user.getPostsCursor();
    const tempPosts: Post[] = [];
    let hasNext = await postCursor?.hasNext();
    while((hasNext) && tempPosts.length < INITIAL_CURSOR_SIZE){
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      tempPosts.push((await postCursor?.pollNext())!);
      hasNext = await postCursor?.hasNext();
    }
    return  {
      username: await user.getUsername(),
      displayName: await user.getDisplayName(),
      hasMorePosts: hasNext,
      bio: await user.getBio(),
      status: await user.getStatus(),
      avatarUrl: await user.getAvatarUrl(),
      numFollowing: await (await user.following || []).length,
      userObject: user,
      postCursor: postCursor,
      posts: tempPosts,
    } as FetchedUserProfile;
  };
};

type FetchedPost = {
    body: string;
    author: User;
    timestamp: Date;
    likes: number;
    imageURLs: string[];
    imageCount: number;
    videoContent:
    | {
        videoURL: string;
        thumbnailURL: string;
      }
    | undefined;
    postObject: Post;
};
export const buildPostFetcher = (post: Post) => {
  return async (): Promise<FetchedPost> => {
    await post.getData();
    return {
      body: await post.getTextContent(),
      author: await post.getAuthor(),
      timestamp: await post.getTimestamp(),
      imageCount: await post.getImageCount(),
      imageURLs: await post.getImageContentUrls(),
      likes: await (await post.getLikes()).length,
      videoContent: (await post.hasVideoContent())
        ? {
          videoURL: await post.getVideoUrl(),
          thumbnailURL: await post.getVideoThumbnailUrl(),
        }
        : undefined,
      postObject: post,
    } as FetchedPost;
  };
};

type FetchedComment = {
    body: string;
    author: User;
    timestamp: Date;
    likes: number;
};
export const buildCommentFetcher = (comment: Comment) => {
  return async (): Promise<FetchedComment> => {
    await comment.getData();
    return {
      body: await comment.getTextContent(),
      author: await comment.getAuthor(),
      timestamp: await comment.getTimestamp(),
      likes: await (await comment.getLikes()).length,
    } as FetchedComment;
  };
};

type FetchedCommentList = {
    commentCursor: QueryCursor<Comment>;
    hasNext: boolean;
    comments: Comment[];
};
export const buildCommentListFetcher = (post: Post) => {
  return async (): Promise<FetchedCommentList> => {
    const commentCursor = post.getCommentsCursor();
    const tempComments: Comment[] = [];
    let hasNext = await commentCursor?.hasNext();
    while((hasNext) && tempComments.length < INITIAL_CURSOR_SIZE){
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      tempComments.push((await commentCursor?.pollNext())!);
      hasNext = await commentCursor?.hasNext();
    }
        
    return {
      commentCursor: commentCursor,
      hasNext: hasNext,
      comments: tempComments,
    } as FetchedCommentList;
  };
};

type FetchedForum = {
    postCursor: QueryCursor<Post>;
    posts: Post[];
    hasMore: boolean;
};
export const buildForumFetcher = (forum: Forum) => {
  return async (): Promise<FetchedForum> => {
    const postCursor = forum.getPostsCursor();
    const tempPosts: Post[] = [];
    let hasNext = await postCursor?.hasNext();
    while((hasNext) && tempPosts.length < INITIAL_CURSOR_SIZE){
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      tempPosts.push((await postCursor?.pollNext())!);
      hasNext = await postCursor?.hasNext();
    }
            
    return {
      postCursor: postCursor,
      posts: tempPosts,
      hasMore: hasNext,
    } as FetchedForum;
  };
};

type FetchedRoute = {
    name: string;
    setter?: {
        raw: boolean | undefined;
        string: string | undefined;
        uid: string | undefined;
    };
    image?: string;
    grade: string;
    forum: Forum;
    description: string;
    archived: RouteStatus;
    routeObject: Route;
};
export const buildRouteFetcher = (route: Route) => {
  return async (): Promise<FetchedRoute> => {
    if (route.docRef === undefined) {
      return Promise.reject('Invalid route ID');
    }
    await route.getData();
    return {
      name: await route.getName(),
      setter: (await route.hasSetter() || await route.hasSetterRawName()) ? {
        raw: await route.hasSetterRawName(),
        string: (await route.hasSetterRawName())
          ? 
          await route.getSetterRawName()
          : 
          await (await route.getSetter()).getDisplayName(),
        uid: await route.hasSetter() ? (await route.getSetter()).docRef!.id : undefined,
      } : undefined,
      grade: await route.getGradeDisplayString(),
      forum: await route.getForum(),
      image: (await route.hasThumbnail()) ? await route.getThumbnailUrl() : undefined,
      description: await route.getDescription(),
      archived: await route.getStatus(),
      routeObject: route,
    } as FetchedRoute;
  };
};
export const buildEmptyRouteByID = (routeID: string | null) => {
  return async (): Promise<Route> => {
    if (routeID === null) {
      return Promise.reject('Empty route ID');
    }
    try {
      const route = getRouteById(routeID);
      return route;
    }
    catch (e) {
      return Promise.reject('Invalid route ID');
    }
  };
};

type FetchedRouteList = {
    archivedCursor: QueryCursor<Route>;
    hasNext: boolean;
    activeRoutes: Route[];
    archivedRoutes: Route[];
};
// Grabs all active routes, and the first INTIIAL_CURSOR_SIZE archived routes
export const buildRouteListFetcher = () => {
  return async (): Promise<FetchedRouteList> => {
    const activeCursor = getActiveRoutesCursor();
    const archivedCursor = getArchivedRoutesCursor();
        
    const activeRoutes: Route[] = [];
    let hasNext = await activeCursor?.hasNext();
    while(hasNext){
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      activeRoutes.push((await activeCursor?.pollNext())!);
      hasNext = await activeCursor?.hasNext();
    }

    const archivedRoutes: Route[] = [];
    hasNext = await archivedCursor?.hasNext();
    while((hasNext) && archivedRoutes.length < INITIAL_CURSOR_SIZE){
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      archivedRoutes.push((await archivedCursor?.pollNext())!);
      hasNext = await archivedCursor?.hasNext();
    }
    return {
      activeRoutes: activeRoutes,
      archivedRoutes: archivedRoutes,
      hasNext: hasNext,
      archivedCursor: archivedCursor,
    };
  };
};