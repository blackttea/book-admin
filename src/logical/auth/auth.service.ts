// src/logical/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { encryptPassword } from '../../utils/cryptogram';
import sequelize from '../../database/sequelize';
import * as Sequelize from 'sequelize';

interface menuItem {
  createdAt?: string;
  updatedAt?: string;
  id: number;
  parentId: number;
  name: string;
  router: string;
  perms?: string;
  type: string;
  icon: string;
  orderNum: number;
  viewPath: string;
  keepalive: boolean;
  isShow: boolean;
  role: number;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // JWT验证 - Step 2: 校验用户信息
  async validateUser(username: string, password: string): Promise<any> {
    console.log('JWT验证 - Step 2: 校验用户信息');
    const user = await this.usersService.findOne(username);
    if (user) {
      const hashedPassword = user.password;
      const salt = user.salt;
      // 通过密码盐，加密传参，再与数据库里的比较，判断是否相等
      const hashPassword = encryptPassword(password, salt);
      if (hashedPassword === hashPassword) {
        // 密码正确
        return {
          code: 1,
          user,
        };
      } else {
        // 密码错误
        return {
          code: 2,
          user: null,
        };
      }
    }
    // 查无此人
    return {
      code: 3,
      user: null,
    };
  }
  async getMenu(user: any) {
    const menus: Array<object> = [],
      perms = [];
    const { role } = user;
    const sql = `
      SELECT
        created_at createdAt, updated_at updatedAt, id, parent_id parentId,
        name, router, perms, type, icon, order_num orderNum, view_path viewPath,
        keepalive, is_show isShow, role
      FROM
        sys_menu
      WHERE
        role <= ${role}
    `;
    try {
      const menu: Array<menuItem> = await sequelize.query(sql, {
        type: Sequelize.QueryTypes.SELECT, // 查询方式
        raw: true, // 是否使用数组组装的方式展示结果
        logging: true, // 是否将 SQL 语句打印到控制台
      });
      for (const _item of menu) {
        menus.push(_item);
        _item.perms && perms.push(_item.perms);
      }
      return [menus, perms];
    } catch (error) {
      console.error(error);
      return void 0;
    }
  }
  // JWT验证 - Step 3: 处理 jwt 签证
  async certificate(user: any) {
    const payload = {
      username: user.username,
      sub: user.userId,
      realName: user.realName,
      role: user.role,
    };
    console.log('JWT验证 - Step 3: 处理 jwt 签证');
    try {
      const menuData = await this.getMenu(user);
      const [menus, perms] = menuData;
      const token = this.jwtService.sign(payload);
      return {
        code: 200,
        data: {
          token,
          menus,
          perms,
        },
        msg: `登录成功`,
      };
    } catch (error) {
      return {
        code: 600,
        msg: `账号或密码错误`,
      };
    }
  }
}
