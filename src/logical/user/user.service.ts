// src/logical/user/user.service.ts
import { Injectable } from '@nestjs/common';
import * as Sequelize from 'sequelize'; // 引入 Sequelize 库
import sequelize from '../../database/sequelize'; // 引入 Sequelize 实例

import { makeSalt, encryptPassword } from '../../utils/cryptogram'; // 引入加密函数

@Injectable()
export class UserService {
  async getInfo(username) {
    const sql = `
      SELECT created_at, updated_at, department_id ,name ,username ,password ,nick_name ,head_img ,email ,phone ,remark ,salt ,status
      FROM
        sys_user
      WHERE
        username = '${username}'
    `;
    try {
      const user = (
        await sequelize.query(sql, {
          type: Sequelize.QueryTypes.SELECT, // 查询方式
          raw: true, // 是否使用数组组装的方式展示结果
          logging: true, // 是否将 SQL 语句打印到控制台
        })
      )[0];
      // 若查不到用户，则 user === undefined
      return { code: 200, data: user };
    } catch (error) {
      console.error(error);
      return void 0;
    }
  }
  /**
   * 查询是否有该用户
   * @param username 用户名
   */
  async findOne(username: string): Promise<any | undefined> {
    const sql = `
      SELECT username, password, id, salt, role
      FROM
        sys_user
      WHERE
        username = '${username}'
    `;
    try {
      const user = (
        await sequelize.query(sql, {
          type: Sequelize.QueryTypes.SELECT, // 查询方式
          raw: true, // 是否使用数组组装的方式展示结果
          logging: true, // 是否将 SQL 语句打印到控制台
        })
      )[0];
      // 若查不到用户，则 user === undefined
      return user;
    } catch (error) {
      console.error(error);
      return void 0;
    }
  }
  /**
   * 注册
   * @param requestBody 请求体
   */
  async register(requestBody: any): Promise<any> {
    const {
      createdAt,
      updatedAt,
      departmentId,
      name,
      username,
      password,
      repassword,
      nickName,
      headImg,
      email,
      phone,
      remark,
      status,
    } = requestBody;
    if (password !== repassword) {
      return {
        code: 400,
        msg: '两次密码输入不一致',
      };
    }
    const user = await this.findOne(username);
    if (user) {
      return {
        code: 400,
        msg: '用户已存在',
      };
    }
    const salt = makeSalt(); // 制作密码盐
    const hashPwd = encryptPassword(password, salt); // 加密密码
    const registerSQL = `
      INSERT INTO sys_user
        (created_at, updated_at, department_id ,name ,username ,password ,nick_name ,head_img ,email ,phone ,remark ,salt ,status)
      VALUES
        ('${createdAt}', '${updatedAt}', '${departmentId}', '${name}', '${username}', '${hashPwd}', '${nickName}', '${headImg}', '${email}', '${phone}', '${remark}', '${salt}', '${status}')
    `;
    try {
      await sequelize.query(registerSQL, { logging: false });
      return {
        code: 200,
        msg: 'Success',
      };
    } catch (error) {
      return {
        code: 503,
        msg: `Service error: ${error}`,
      };
    }
  }
}
