# Git 협업을 위한 커밋 메시지와 PR 작성 완벽 가이드

---

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMjNfMjgz/MDAxNzYzODI0ODg1MzUz.oxODOBuRJVB-EYjLFTWph7IuU4eUxGVX0MX97GSmQaIg.kY1Qx6PgptdxBzLk62xD-W7xsR6hSQfs9gADt0XvT5cg.PNG/img_000_d07cf59b.png?type=w80_blur) ](<#>)

**커밋 메시지의 구조와 규칙**

효율적인 협업을 위해서는 일관성 있는 커밋 메시지 작성이 필수입니다. 커밋 메시지는 기본적으로 제목, 본문, 꼬리말 세 부분으로 구성되며, 각 파트는 빈 줄로 구분합니다.

제목(Subject)은 커밋의 첫 인상을 결정하는 중요한 부분입니다. 영문 기준 50자 이내로 작성하며, 첫 글자는 반드시 대문자로 시작합니다. 제목 끝에 마침표를 붙이지 않으며, 과거 시제 대신 명령형으로 작성합니다. 예를 들어 "Fixed" 대신 "Fix", "Added" 대신 "Add"로 표현합니다.

제목 앞에는 커밋의 유형을 나타내는 태그를 붙입니다. Feat는 새로운 기능 추가, Fix는 버그 수정, Design은 UI 디자인 변경, Style은 코드 포맷 변경, Refactor는 코드 리팩토링, Docs는 문서 수정, Test는 테스트 코드 추가, Chore는 빌드 설정 변경 등을 의미합니다. 급한 버그 수정의 경우 !HOTFIX를, 큰 API 변경의 경우 !BREAKING CHANGE를 사용합니다.

​

**본문과 꼬리말 작성법**

본문(Body)은 선택사항이지만, 변경 사항의 이유나 부연 설명이 필요할 때 작성합니다. 72자를 넘기지 않도록 주의하며, "어떻게" 변경했는지보다 "무엇을", "왜" 변경했는지에 초점을 맞춥니다. 여러 줄의 메시지는 하이픈(-)으로 구분하여 작성합니다.

꼬리말(Footer)도 선택사항으로, 이슈 트래커 ID를 명시할 때 사용합니다. "유형: #이슈번호" 형식으로 작성하며, Fixes는 이슈 수정 중(아직 해결되지 않은 경우), Resolves는 이슈를 해결했을 때, Ref는 참고할 이슈가 있을 때, Related to는 관련된 이슈번호를 나타낼 때 사용합니다. 여러 개의 이슈번호는 쉼표로 구분합니다.

**브랜치 이름 규칙**

브랜치 이름도 일관성 있게 관리해야 합니다. main 브랜치는 프로덕션 스냅샷으로 가장 최신의 배포된 버전을 유지합니다. dev 브랜치는 릴리즈 계획에 따라 기본 브랜치로 지정되며, feature 브랜치는 "feature/이슈번호-이름" 형식으로 dev에 병합됩니다. hotfix 브랜치는 "hotfix/이슈번호" 형식으로 main에 직접 병합됩니다.

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMjNfNTIg/MDAxNzYzODI0OTAxNzM3.8wPrNE9hFzfLOcCqgpWOTNAJHZvkCB2HAcQgFGWyGh4g.07phaq_zI6rt8TeXs1qgyix3QMw3N4HSC11VaFps-Ekg.PNG/img_001_5c85dfbe.png?type=w80_blur) ](<#>)

**Pull Request 작성의 중요성**

Pull Request(PR)는 단순한 코드 병합 요청이 아니라 팀원들과의 소통 수단입니다. PR을 작성할 때는 먼저 코드 컨벤션을 철저히 지켜야 합니다. 컨벤션 오류로 인한 불필요한 코멘트는 리뷰 시간을 낭비하게 됩니다.

리뷰 가이드를 명확하게 작성하는 것도 중요합니다. 모든 코드 변경사항에는 의도가 있어야 하며, 의도치 않게 변경된 부분이 있다면 되돌려야 합니다. 단순한 줄바꿈 같은 변경이라면 "Just line change"와 같은 코멘트를 달아 리뷰어의 시간을 절약할 수 있습니다. 라이브러리 업데이트가 포함되었다면 해당 라이브러리의 릴리즈 노트 링크나 스크린샷을 첨부하는 것이 좋습니다.

​

**PR 작성 상태 관리**

작업 중인 PR과 리뷰 가능한 PR을 명확히 구분해야 합니다. 아직 코드를 작성 중일 때는 제목 앞에 [WIP](Work in Progress)를 추가합니다. 작업이 완료되면 이를 제거하고 review-needed 태그를 설정합니다. 리뷰를 반영하는 중에도 이 과정을 반복하여 현재 상태를 명시해야 합니다.

​

PR 본문은 템플릿을 활용하여 일관성 있게 작성합니다. PR 타입(기능 추가, 기능 삭제, 버그 수정, 의존성 업데이트 등)을 선택하고, 반영 브랜치(예: feat/login → dev)를 명시합니다. 변경 사항을 구체적으로 설명하고, 테스트 결과를 스크린샷이나 GIF로 첨부하면 리뷰어가 더 쉽게 이해할 수 있습니다.

​

**GitHub 이슈 관리**

효율적인 협업을 위해서는 이슈 관리도 중요합니다. 이슈는 "내가 작업해야 할 사항"을 의미하며, 프로젝트의 문제, 버그, 제안, 개선 사항을 추적하고 토론할 수 있는 기능입니다.

​

이슈를 생성하기 전에 ".gitignore 파일"이 포함된 협업 저장소가 준비되어 있고, 로컬 저장소와 원격 저장소가 연결되어 있는지 확인해야 합니다. New Issue를 클릭하면 이슈 템플릿을 선택할 수 있습니다. 버그 수정이면 버그 리포트 이슈를, 일반 기능 작업이면 기능 이슈를 선택합니다.

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMjNfMjIz/MDAxNzYzODI0NTMwMjMz.uFtSBkzrumxuO0JG_EudhQfpTw5MjjorCoIKxfCpyqEg.E_fLjQSpH1LZCCCoCBmSKGlXioTVrRuQ_RLsf-PzUzsg.PNG/image.png?type=w80_blur) ](<#>)

​

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMjNfMjY0/MDAxNzYzODI0NjAzMDMw.I6cYE4W4XxsNF-UskI7QrdM5P5XEkOIjUBJFHnhGbSMg.uNASAONqlIbk9P3UdxUbWa4k3c6IfSd6KdTN3XXg4zEg.PNG/image.png?type=w80_blur) ](<#>)

**​**

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMjNfNzgg/MDAxNzYzODI0NzU3NDI5.PqXCpeAo1Kt9O1vQtaHKdgnr9EnIOalOIsVhidXvm1wg.6xeZI9zAT3sznICwRjsc3_5I-YhigmFywLfqaLpED90g.PNG/image.png?type=w80_blur) ](<#>)

**​**

**이슈 작성 요소**

이슈 제목은 어떤 작업을 하려고 하는지 명확하게 작성합니다. 이슈 탭에서 바로 보이는 만큼 한눈에 파악할 수 있어야 합니다. 이슈 내용은 템플릿에 맞게 작성하며, 작업을 상세히 나누어 적고 각 단위로 커밋하는 방식을 따릅니다.

​

Assignees에서 작업의 담당자를 설정합니다. 보통 이슈를 만든 본인이 담당자가 되지만, 다른 사람의 작업을 위해 이슈를 만드는 경우 해당 담당자를 선택합니다. Labels를 통해 이슈의 성격을 태그처럼 표시하면, 나중에 관련 이슈를 쉽게 찾을 수 있습니다.

**​**

**브랜치 생성과 체크아웃**

이슈를 생성한 후 "Create a branch" 버튼을 클릭하면 새로운 브랜치를 생성할 수 있습니다. 브랜치 이름은 영어로 지으며, "#1-myPage-Login" 같은 형식으로 이슈 번호를 포함하는 것이 좋습니다.

​

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMjNfMjQ4/MDAxNzYzODI0ODA4OTk0.PhcXPSQSXwFMKqDtR3rlHqpIrNZ23G0GLbui3AbFevEg.aiSsfwd6IbgfkH1ZS03g38rMOCH8Ta0fDgg2Yu4AV_Ig.PNG/image.png?type=w80_blur) ](<#>)

로컬에서 체크아웃하려면 먼저 원격 저장소의 변경 사항을 가져와야 합니다. "git fetch origin" 명령을 실행하면 원격 저장소의 최신 변경 사항을 로컬에서 확인할 수 있습니다. 이후 제공된 체크아웃 명령을 실행하면 새로운 브랜치로 전환됩니다. Xcode 같은 IDE에서도 브랜치가 변경되었는지 반드시 확인해야 합니다.

​

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMjNfMjkz/MDAxNzYzODI0ODM2MzQy.YoL6TJq9TVp1TKLHtLVVmgFsxDG6rSQsaLH5taZRGT4g.12emshXk17tcF0MjJp6gXqTIYcZDzfJwbzfA5ldY5tkg.PNG/image.png?type=w80_blur) ](<#>)

**​**

**Pull Request 제출 과정**

작업을 완료하고 commit, push를 하면 GitHub에 자동으로 초록색 "Compare & Pull Request" 버튼이 나타납니다. 이는 commit과 push가 성공적으로 완료되었음을 의미합니다.

​

"Compare & pull request"를 클릭하면 PR 작성 화면으로 이동합니다. PR 제목은 전체 내용을 요약하도록 작성하고, 내용은 마크다운 문법을 활용하여 템플릿에 맞게 작성합니다. 이슈 번호를 입력하면 자동으로 브랜치와 이슈가 연결됩니다.

[ ![](https://mblogthumb-phinf.pstatic.net/MjAyNTExMjNfMTAy/MDAxNzYzODI0OTY4OTM2.enmwrmtsKNIYzwZSpXjyUOhKSqA7zDVMvAvDvAtUaz8g.5gM2YHyb212f5h89zoL32GXRh8lfnYh9iRlaGbsnrvMg.PNG/img_010_bad168bb.png?type=w80_blur) ](<#>)

Reviewer에서 리뷰를 요청할 팀원들을 선택합니다. 보통 팀원 모두를 선택하는 것을 권장합니다. Assignees에서는 작성자 본인을 설정하고, Labels에서는 작업 내용에 맞는 라벨을 선택합니다. 이슈를 만들 때 선택한 라벨과 동일하게 설정하는 것이 좋습니다.

**​**

**​**

**협업 워크플로우 정리**

GitHub 협업의 기본 흐름은 다음과 같습니다. 첫째, 이슈를 생성하여 작업 내용을 명시합니다. 둘째, 이슈를 바탕으로 브랜치를 생성합니다. 셋째, 브랜치에서 작업을 진행하고 커밋합니다. 넷째, Pull Request를 작성하여 코드 리뷰를 요청합니다. 다섯째, 리뷰 피드백을 반영하고 브랜치를 병합합니다.

이 과정에서 커밋 메시지와 PR 작성이 명확하고 일관성 있으면, 팀원들이 변경 사항을 쉽게 이해할 수 있고 코드 리뷰 시간을 단축할 수 있습니다. 또한 프로젝트의 히스토리를 추적하기도 쉬워집니다.

특정 브랜치만 pull하려면 "git pull origin [브랜치명]" 명령을 사용하면 됩니다. 단순히 "git pull"을 하는 것보다 이 방식을 습관적으로 사용하면 실수를 방지할 수 있습니다.

Git 이모지를 활용하면 커밋 메시지를 더 시각적으로 표현할 수 있습니다. 🎨는 코드 형식 개선, 📝는 사소한 코드 변경, 🐛는 버그 리포팅, 🚑은 버그 수정, 📚는 문서 작성, 🔥는 코드 제거, 🔨는 리팩토링, ☔️는 테스트 추가, 💚는 CI 빌드 수정, ✨는 새로운 기능 소개 등을 나타냅니다.

이러한 규칙과 관례를 따르면 팀 전체가 일관성 있는 코드 관리를 할 수 있고, 프로젝트의 가독성과 유지보수성이 크게 향상됩니다.

​

​

​

​

#Git #GitHub #커밋메시지 #PullRequest #협업

[원문 보기](https://blog.naver.com/choidz_/224084824219?fromRss=true&trackingCode=rss)
