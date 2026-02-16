Projekt Agil utveckling

Vid start i terminal:

- git branch main
- git pull (på main branch för att få senaste ändringarna)
- git status (kolla så allt ser bra ut)

Under arbete:

- git branch "ditt branchnamn" (byt till din branch)
- gör ändringar du vill göra i din branch
- git add .
- git commit -m "beskrivning av dina ändringar"
- git push

efter git push:

- gå in på github.com
- Gå till "pull request" fliken
- new pull request - base: main <-- compare: "ditt branchnamn"
- create pull request
- minst 1 person kollar innan merge till main
- klart!
