"use client";

import { User,setAuthFromServer } from "@/app/store/AuthSlice";
import { useAppDispatch } from "@/app/store/hooks";
import { useEffect } from "react";


export default function AuthHydrator({ user }: {user:User|null}) {
  const dispatch = useAppDispatch();
console.log(user);

  useEffect(() => {
    if (user) {
      dispatch(setAuthFromServer(user));
    }
  }, [user, dispatch]);

  return null;
}
