import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const VIEW_COOLDOWN = 24 * 60 * 60 * 1000; // 24시간

function getLastViewTime(slug) {
  try {
    const data = localStorage.getItem(`post_view_${slug}`);
    return data ? parseInt(data, 10) : 0;
  } catch {
    return 0;
  }
}

function setLastViewTime(slug) {
  try {
    localStorage.setItem(`post_view_${slug}`, Date.now().toString());
  } catch {
    // localStorage가 비활성화된 경우 무시
  }
}

export function usePostViews(slug) {
  const [views, setViews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!db || !slug) {
      setIsLoading(false);
      return;
    }

    async function loadAndIncrementViews() {
      try {
        const docRef = doc(db, 'post_views', slug);
        const docSnap = await getDoc(docRef);

        let currentViews = 0;

        if (docSnap.exists()) {
          currentViews = docSnap.data().view_count || 0;
          setViews(currentViews);
        }

        // 중복 조회 체크
        const lastViewTime = getLastViewTime(slug);
        const now = Date.now();
        const shouldIncrement = now - lastViewTime > VIEW_COOLDOWN;

        if (shouldIncrement) {
          if (docSnap.exists()) {
            // 문서가 존재하면 조회수만 증가
            await updateDoc(docRef, {
              view_count: increment(1),
              updated_at: new Date().toISOString(),
            });
            setViews(currentViews + 1);
          } else {
            // 문서가 없으면 새로 생성
            await setDoc(docRef, {
              slug,
              view_count: 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
            setViews(1);
          }
          setLastViewTime(slug);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error in view tracking:', err);
        setIsLoading(false);
      }
    }

    loadAndIncrementViews();
  }, [slug]);

  return { views, isLoading };
}

export async function getPostViewsMap(slugs) {
  if (!db || !slugs?.length) {
    return {};
  }

  try {
    // Firestore는 'in' 쿼리가 최대 10개 제한이 있어서 배치로 처리
    const batchSize = 10;
    const results = {};

    for (let i = 0; i < slugs.length; i += batchSize) {
      const batchSlugs = slugs.slice(i, i + batchSize);
      const q = query(
        collection(db, 'post_views'),
        where('slug', 'in', batchSlugs)
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        results[data.slug] = data.view_count || 0;
      });
    }

    return results;
  } catch (err) {
    console.error('Error fetching views map:', err);
    return {};
  }
}
