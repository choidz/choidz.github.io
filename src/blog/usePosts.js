import { useEffect, useState } from "react";

const POSTS_MANIFEST_URL = "/posts/index.json";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPosts() {
      try {
        setIsLoading(true);
        const response = await fetch(POSTS_MANIFEST_URL);
        if (!response.ok) {
          throw new Error(`포스트 목록을 불러오지 못했습니다 (status ${response.status})`);
        }
        const data = await response.json();
        if (!cancelled) {
          setPosts(Array.isArray(data) ? data : []);
          setIsLoading(false);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message);
          setIsLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  return { posts, isLoading, error };
}

export default usePosts;
