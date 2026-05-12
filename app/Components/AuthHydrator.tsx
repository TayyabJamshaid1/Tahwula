"use client";

import { useEffect } from "react";
import { useAppDispatch } from "../lib/hooks";
import { setAuthFromServer, User } from "../lib/AuthSlice";

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
