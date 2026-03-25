# BravoBall Mental Training Quiz

## Purpose

This branch adds a hidden web-based mental training quiz flow to the BravoBall landing site so the team can test user demand for a tactical soccer IQ feature before building it into the main product.

Route:

- `/mental-training-demo`
- Debug mode: `/mental-training-demo?debug=1`

## What Is Implemented

### Hidden quiz route

- Added a new route in `src/App.tsx` for `/mental-training-demo`
- The route is not linked from the public landing page

### Quiz flow

- Landing screen
- Question flow with progress bar
- Score screen
- Feedback form
- Submitted state

All quiz state is local React state in `src/features/mentalTraining/MentalTrainingQuizPage.tsx`.

### Video behavior

Current intended behavior:

- User starts a question by watching the clip setup
- Video auto-plays if the browser allows it
- Video pauses at a question-specific `pauseAt` timestamp
- Before answering, the question UI appears only after the pause point
- Before answering, native video controls are disabled
- After answering, the user can replay the full clip and watch the rest of the play

Implementation details:

- `safePlay(...)` ignores browser `AbortError` noise from repeated play/pause interruptions
- Pre-answer seeking is constrained in code
- After answering, full playback is allowed

### Debug mode

Debug mode was added for testing without having to complete each question:

- `?debug=1`
- Shows `Previous Question` and `Skip Forward`

This is only a URL-driven testing aid and does not affect the normal quiz route.

## Quiz data structure

Quiz content currently lives in:

- `src/data/mentalTrainingQuiz.json`

Schema currently used per question:

- `id`
- `clipUrl`
- `pauseAt`
- `position`
- `difficulty`
- `question`
- `options`
- `correctAnswer`
- `explanation`

Type definitions live in:

- `src/features/mentalTraining/types.ts`

## Current five-question set

The current test set uses these clips:

1. `pedri-barcaVbetis-1.mp4`
2. `pedri-barcaVbetis-2.mp4`
3. `pedri-barcaVbetis-3.mp4`
4. `pedri-barcaVbetis-4.mp4`
5. `pedri-barcaVbetis-7.mp4`

These are hosted in:

- `https://bravoball-quiz-clips.s3.us-east-2.amazonaws.com/midfield/`

## Clip preparation workflow used

The original iPhone/ReplayKit `.mov` files were not reliable for browser playback because of the container/codec combination.

What was done:

- Converted `.mov` clips to browser-safe `.mp4`
- Codec used: H.264 video + AAC audio
- Uploaded converted files to the existing S3 bucket

Example conversion command:

```sh
ffmpeg -y -i input.mov -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k output.mp4
```

Example batch upload:

```sh
aws s3 cp ~/Downloads/bravoball-quiz-mp4/ s3://bravoball-quiz-clips/midfield/ --recursive --exclude '*' --include '*.mp4'
```

## Supabase integration

Supabase client already existed in the landing repo:

- `src/lib/supabase.ts`

Added submission layer:

- `src/features/mentalTraining/api.ts`

Current submission design:

- `mental_quiz_sessions`
- `mental_quiz_answers`

The feedback form is intended to submit:

- name
- email
- score
- rating
- would-use-feature
- requested-more
- review
- answer-level records

## Main implementation files

- `src/App.tsx`
- `src/data/mentalTrainingQuiz.json`
- `src/features/mentalTraining/MentalTrainingQuizPage.tsx`
- `src/features/mentalTraining/api.ts`
- `src/features/mentalTraining/types.ts`

## Known limitations / next work

### Question navigation state

- Back-navigation with preserved per-question UI state was requested but has not been fully implemented yet
- Answer records are persisted, but the question screen still needs a cleaner revisit experience

### Video polish

- Native browser video behavior is still being managed with custom state on top
- If stricter pre-answer control is needed, a custom overlay/progress UI may be better than relying on native media controls

### Content expansion

- The current flow is set up for five test questions
- The JSON can be extended later without changing core component logic
