import { useRef, useEffect } from "react";
import {
  useContractWrite as useContractWriteWagmi,
  useWaitForTransaction,
} from "wagmi";
import toast from "react-hot-toast";
import type { Optional } from "~/types";

type UseContractWriteArgs = Parameters<typeof useContractWriteWagmi>;

const renderStatusWithHeader = (message: string, headerMessage?: string) => {
  if (!headerMessage) {
    return message;
  }

  return (
    <>
      <p className="truncate text-sm font-medium text-white">{headerMessage}</p>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </>
  );
};

// A wrapper for useContractWriteWagmi that adds a toast notification
export const useContractWrite = (
  statusHeader: Optional<string>,
  ...args: UseContractWriteArgs
) => {
  const result = useContractWriteWagmi(...args);

  const transaction = useWaitForTransaction({ hash: result.data?.hash });

  const toastId = useRef<Optional<string>>(undefined);

  const isLoading = transaction.status === "loading" || result.isLoading;

  const isError = transaction.status === "error" || result.isError;

  const isSuccess = transaction.status === "success";

  useEffect(() => {
    if (isLoading) {
      if (toastId.current) {
        toast.loading(
          renderStatusWithHeader("Transaction in progress...", statusHeader),
          {
            id: toastId.current,
          }
        );
      } else {
        toastId.current = toast.loading(
          renderStatusWithHeader("Transaction in progress...", statusHeader)
        );
      }
    } else if (transaction.status === "success") {
      toast.success(
        renderStatusWithHeader("Transaction successful", statusHeader),
        {
          id: toastId.current,
        }
      );
    } else if (isError) {
      toast.error(renderStatusWithHeader("Transaction failed", statusHeader), {
        id: toastId.current,
      });
    }
  }, [isError, isLoading, statusHeader, transaction.status]);

  return {
    ...result,
    isLoading,
    isError,
    isSuccess,
    write: result.write,
  };
};
