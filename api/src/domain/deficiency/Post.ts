/* eslint-disable accessor-pairs */
import { plainToInstance } from 'class-transformer'
import {
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max
} from 'class-validator'

import { Entity } from '../entity'

export class Post extends Entity {
  private _title: string;
  private _text: string;
  private _rating: number;
  private _email: string;
  private _site: string;
  private _createDate: Date;

  constructor (
    title: string,
    text: string,
    rating: number,
    email: string,
    createDate: Date
  ) {
    super()
    this.title = title
    this.text = text
    this.rating = rating
    this.email = email
    this.createDate = createDate
  }

  @Length(10, 20)
  public set title (value: string) { this._title = value }

  public get title (): string { return this._title }

  @Contains('hello')
  public set text (value: string) { this._text = this.text }

  public get text (): string { return this._text }

  @IsInt()
  @Min(0)
  @Max(10)
  public set rating (value: number) { this._rating = this.rating }

  public get rating (): number { return this._rating }

  @IsEmail()
  public set email (value: string) { this._email = this.email }

  public get email (): string { return this._email }

  @IsFQDN()
  public set site (value: string) { this._site = value }

  public get site (): string { return this._site }

  @IsDate()
  public set createDate (value: Date) { this._createDate = value }

  public get createDate (): Date { return this._createDate }
}

(async () => {
  const objInput = {
    title: 'Hello',
    text: 'this is a great post about hell world',
    rating: 11,
    site: 'google.com',
    createDate: 'googlecom',
    test: '123'
  }

  const post = plainToInstance(Post, objInput)

  try {
    await post.validateOrFail()
  } catch (err) {
    console.log(err)
  }
})()

// const post2 = plainToInstance(Post2, post)

// console.log(post.title)

// console.log(post2)

// validate(post, { }).then(errors => {
//   // errors is an array of validation errors
//   if (errors.length > 0) {
//     console.log('validation failed. errors: ', errors)
//   } else {
//     console.log('validation succeed')
//   }
// })

// validateOrReject(post).catch(errors => {
//   console.log('Promise rejected (validation failed). Errors: ', errors)
// })
// // or
// async function validateOrRejectExample (input) {
//   try {
//     await validateOrReject(input)
//   } catch (errors) {
//     console.log('Caught promise rejection (validation failed). Errors: ', errors)
//   }
// }
