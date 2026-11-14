# Supabase에서 Row Level Security 정책 오류 해결하기

## 증상 및 오류 메시지
Supabase에서 Row Level Security(RLS)를 활성화한 후에 데이터를 조회하거나 삽입할 때 `new row violates row-level security policy`라는 오류 메시지를 자주 만나게 됩니다. 이 오류는 데이터베이스의 보안 정책이 현재 요청한 사용자의 권한과 일치하지 않을 때 발생합니다. 예를 들어, 사용자가 자신의 데이터에 접근하려고 할 때, 해당 데이터에 대한 적절한 정책이 설정되어 있지 않으면 빈 배열이 반환되거나 삽입이 실패하게 됩니다.

## 원인 분석
이 오류의 대표적인 원인은 다음과 같습니다. 첫째, RLS가 활성화되어 있지만, 필요한 정책이 설정되지 않았을 수 있습니다. 둘째, 사용자가 요청하는 데이터의 `user_id`가 현재 로그인한 사용자의 ID와 일치하지 않는 경우입니다. 셋째, 로그인하지 않은 상태에서 데이터를 삽입하려고 할 때도 이 오류가 발생할 수 있습니다. 이러한 원인들을 확인하기 위해 다음과 같은 SQL 명령어를 사용할 수 있습니다.

```sql
SELECT * FROM pg_policies WHERE tablename = 'your_table_name';
```

이 명령어를 통해 현재 테이블에 설정된 정책을 확인할 수 있습니다. 만약 결과가 없다면, 정책이 설정되지 않은 것입니다.

## 해결 절차
문제를 해결하기 위해서는 다음과 같은 절차를 따릅니다.

1. **RLS 활성화 확인**: RLS가 설정된 테이블에 대해 RLS가 활성화되어 있는지 확인합니다. SQL 명령어는 다음과 같습니다.
   ```sql
   ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;
   ```

2. **정책 생성**: 필요한 정책을 생성합니다. 예를 들어, 사용자가 자신의 데이터만 조회하거나 삽입할 수 있도록 정책을 설정할 수 있습니다.
   ```sql
   CREATE POLICY "own_data_select" ON your_table_name
   FOR SELECT
   USING (auth.uid() = user_id);
   ```
   위의 정책은 사용자가 자신의 데이터만 조회할 수 있도록 허용합니다.

3. **정책 확인**: 생성한 정책이 올바르게 설정되었는지 확인합니다. SQL 명령어를 사용하여 정책을 확인할 수 있습니다.
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'your_table_name';
   ```

4. **로그인 상태 확인**: 사용자가 로그인 상태인지 확인하고, `auth.uid()`가 NULL인지 체크합니다. 로그인하지 않은 경우, 데이터에 접근할 수 없습니다.

## 흔한 실수
개발 중 자주 발생하는 실수로는 다음과 같은 것들이 있습니다.
- 정책을 생성하지 않고 RLS를 활성화한 경우
- `user_id`를 잘못 설정하거나, 로그인한 사용자의 ID와 일치하지 않는 값을 넣은 경우
- 로그인하지 않은 상태에서 데이터를 삽입하려는 경우

이러한 실수를 피하기 위해서는 항상 정책을 설정한 후에 RLS를 활성화하고, 요청 시 올바른 사용자 ID를 사용하는지 확인해야 합니다.

## 재발 방지 체크리스트
1. RLS가 활성화된 테이블에 대해 필요한 모든 정책이 설정되었는지 확인합니다.
2. 각 정책이 올바르게 작동하는지 테스트합니다.
3. 로그인 상태를 항상 확인하고, `auth.uid()`가 NULL이 아닌지 체크합니다.
4. 데이터 삽입 시 `user_id`가 현재 로그인한 사용자와 일치하는지 확인합니다.

위의 절차를 따르면 Supabase에서 Row Level Security 정책으로 인한 오류를 효과적으로 해결할 수 있습니다. 각 단계에서 발생할 수 있는 문제를 미리 예방하고, 필요한 정책을 적절히 설정하여 데이터 보안을 강화하세요.

## 실무 적용 체크리스트

- Supabase row level security policy 오류 해결을 적용하기 전에 현재 운영 환경의 기준값과 예외 상황을 먼저 정리합니다.
- 변경 전후로 확인할 지표를 정하고, 문제가 생겼을 때 되돌릴 수 있는 절차를 문서화합니다.
- 한 번에 모든 서버나 서비스에 적용하기보다 작은 범위에서 검증한 뒤 점진적으로 확대합니다.
- 담당자, 확인 시간, 장애 판단 기준을 명확히 남겨 같은 문제가 반복될 때 빠르게 대응할 수 있게 합니다.

![Supabase에서 Row Level Security 정책 오류 해결하기 안내 이미지](/images/posts/supabase에서-row-level-security-정책-오류-해결하기-00-guide.svg)

## 참고한 자료

- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
