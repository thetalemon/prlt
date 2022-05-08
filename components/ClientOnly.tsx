import { useEffect, useState } from "react";
import { ReactNode } from 'react';

export default function ClientOnly({ children, ...delegated }: {
  children: ReactNode
}) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (<div {...delegated}>{children}</div>);
}