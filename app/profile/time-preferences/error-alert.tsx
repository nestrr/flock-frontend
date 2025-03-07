"use client";
import { Alert } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { DAYS } from "../../shared/constants";
import { useProfileEdit } from "../shared/profile-edit-context";

export default function ErrorAlert() {
  const { errors } = useProfileEdit();
  const [error, setError] = useState("");
  useEffect(() => {
    if (errors.DUPLICATE_TIMESLOT) {
      setError(
        `You've chosen the same timeslot more than once on ${errors.DUPLICATE_TIMESLOT.map((t) => DAYS[t.day]).join(", ")}.`
      );
    } else {
      setError("");
    }
  }, [errors, errors.DUPLICATE_TIMESLOT]);
  return errors.DUPLICATE_TIMESLOT ? (
    <Alert.Root status="error" justifyContent="center">
      {error}
    </Alert.Root>
  ) : (
    <></>
  );
}
