# EYFI Leaderboard

The supplied EYFI leaderboard frontend is connected to a lightweight Express API with mock JSON data.

## Demo Video

[Watch the EYFI Leaderboard Demo](https://drive.google.com/file/d/1kvCDY0F3uZhFr0mmBAjSHH8ZdxM14kjN/view?usp=sharing)

## Run

Requires Node.js 18+.

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## API

- `GET /api/leaderboard`
- `GET /api/leaderboard?filter=solo`
- `GET /api/leaderboard?filter=team`
- `GET /api/stats`
- `GET /api/participants/:id`
- `POST /api/earnings`

Example:

```json
{"participantId":9999,"amount":500}
```

The POST endpoint updates the mock JSON state, recalculates ranks and returns the updated leaderboard. The JSON file acts as a mock database for the assignment and can later be replaced by a real database without changing the API contract.
