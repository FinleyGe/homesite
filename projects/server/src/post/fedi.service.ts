import { Injectable } from "@nestjs/common";
import generator from "megalodon";
const BASE_URL = process.env.FEDI_URL;
const accessToken = process.env.FEDI_ACCESS_TOKEN;
const id = process.env.FEDI_ID;
const client = generator('mastodon', BASE_URL, accessToken);

@Injectable()
export class FediService {

  async getPosts() {
    const status = await client.getAccountStatuses(id);
    return status.data.map((s) => {
      return {
        content: s.content,
        language: s.language,
        created_at: s.created_at,
      }
    });
  }
}
