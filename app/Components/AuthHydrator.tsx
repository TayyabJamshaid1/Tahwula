"use client";

import { useEffect } from "react";
import { useAppDispatch } from "../lib/hooks";
import { setAuthFromServer, user } from "../lib/AuthSlice";

export default function AuthHydrator({ user }: {user:user|null}) {
  const dispatch = useAppDispatch();
console.log(user);

  useEffect(() => {
    if (user) {
      dispatch(setAuthFromServer(user));
    }
  }, [user, dispatch]);

  return null;
}
