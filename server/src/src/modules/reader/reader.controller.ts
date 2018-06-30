import { Controller, Post, Get, HttpCode, Req, Query, Body } from '@nestjs/common';
import { ReaderService } from "./reader.service" 
import { Request } from "express"
import { isUndefined } from 'util';

@Controller('reader')
export class ReaderController {

  constructor(
    private readonly readerService: ReaderService
  ) {}

  @Post("/comments")
  async comments(@Req() req: Request) {
    const v   =  req.query["v"]
    const wfc = +req.query["wfc"] || 800
    const was = +req.query["was"] || 2500
    const show = isUndefined(req.query["show"]) ? true : !!Number(req.query["show"])

    console.dir({v, wfc, was, show}, {colors: true})
    if(v) {
      const comments = await this.readerService.getComments(`https://www.youtube.com/watch?v=${v}`, wfc, was)
      if(comments) {
        const lost = comments.filter(com => !com.Author.Image).length
        const count = comments.length
        return {
          comments: show ? comments : [],
          length: count,
          lost,
          statusCode: 200
        };
      } else {
        return {
          comments: [],
          length: 0,
          lost: 0,
          statusCode: 404
        }
      }
    }
    else
      return new Promise((_, rej) => rej({statusCode: 400, message: "Wrong request"}))
  }

}
