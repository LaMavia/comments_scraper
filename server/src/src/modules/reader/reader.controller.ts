import { Controller, Post, Get, HttpCode, Req, Query, Body } from '@nestjs/common';
import { ReaderService } from "./reader.service" 
import { Request } from "express"

@Controller('reader')
export class ReaderController {

  constructor(
    private readonly readerService: ReaderService
  ) {}

  @Post("/comments")
  async comments(@Req() req: Request) {
    const v: string = req.query["v"]
    console.dir(v, {colors: true})
    if(v) {
      const comments = await this.readerService.getComments(`https://www.youtube.com/watch?v=${v}`)
      return {
        comments,
        length: comments.length,
        statusCode: 200
      };
    }
    else
      return new Promise((_, rej) => rej({statusCode: 400, message: "Wrong request"}))
  }

}
