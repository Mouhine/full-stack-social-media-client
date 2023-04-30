import React from "react";

export interface PostType {
  _id?: string;
  title: string; // String is shorthand for {type: String}
  author: {
    id: string;
    firstName: string;
    lastName: string;
    job: string;
    profile: string;
    created_at: Date;
  };
  body: string;
  date: Date;
  likes?: number;
  likedBy?: string[];
  likesCount?: number;
  cover: string;
  tags: [
    {
      id: string;
      body: string;
    }
  ];
}
export interface Auth {
 

  accessToken: string;
  userId: string;
}

export interface Comment {
  _id?: string;
  body: string;
  author: {
    id: string;
    profile: string;
    firstName: string;
    lastName: string;
  };
  belong_to: string;
  likes: number;
}

export interface Follower {
  _id?: string;
  id: string;
  firstName: string;
  lastName: string;
  profile?: string;
  following_by: string;
}
export interface credentials {
  email: string;
  password: string;
}
export interface UserType {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  profile?: string;
  job?: string;
  reading_list?: PostType[];
  Bio?: string;
  created_at?: Date;
  cover?: string;
  followers?: string[];
  follwing?: string[];
}
export interface ReadingListItem extends PostType {
  savedBy: string;
}
