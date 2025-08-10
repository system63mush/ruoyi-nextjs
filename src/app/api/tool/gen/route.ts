import { NextRequest, NextResponse } from 'next/server';

// 模拟数据表信息
const mockTables = [
  {
    tableName: 'sys_user',
    tableComment: '用户表',
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-01 00:00:00'
  },
  {
    tableName: 'sys_role',
    tableComment: '角色表',
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-01 00:00:00'
  },
  {
    tableName: 'sys_menu',
    tableComment: '菜单表',
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-01 00:00:00'
  }
];

// 获取数据表列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tableName = searchParams.get('tableName');
    const tableComment = searchParams.get('tableComment');

    let filteredTables = mockTables;
    
    if (tableName) {
      filteredTables = filteredTables.filter(table => 
        table.tableName.includes(tableName)
      );
    }
    
    if (tableComment) {
      filteredTables = filteredTables.filter(table => 
        table.tableComment.includes(tableComment)
      );
    }

    return NextResponse.json({
      code: 200,
      msg: '操作成功',
      rows: filteredTables,
      total: filteredTables.length
    });
  } catch (error) {
    console.error('获取数据表列表失败:', error);
    return NextResponse.json(
      { code: 500, msg: '获取数据表列表失败' },
      { status: 500 }
    );
  }
}

// 获取表字段信息
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tableName } = body;
    
    // 模拟表字段信息
    const mockColumns = [
      {
        columnName: 'id',
        columnComment: '主键ID',
        columnType: 'varchar(32)',
        isRequired: '1',
        isPk: '1'
      },
      {
        columnName: 'create_time',
        columnComment: '创建时间',
        columnType: 'datetime',
        isRequired: '1',
        isPk: '0'
      }
    ];

    return NextResponse.json({
      code: 200,
      msg: '操作成功',
      data: {
        tableName,
        columns: mockColumns
      }
    });
  } catch (error) {
    console.error('获取表字段信息失败:', error);
    return NextResponse.json(
      { code: 500, msg: '获取表字段信息失败' },
      { status: 500 }
    );
  }
}

// 生成代码
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { tableName, columns, options } = body;
    
    // 这里应该实现真正的代码生成逻辑
    // 生成Controller、Service、Entity等文件

    return NextResponse.json({
      code: 200,
      msg: '代码生成成功',
      data: {
        downloadUrl: `/api/tool/gen/download?tableName=${tableName}`
      }
    });
  } catch (error) {
    console.error('代码生成失败:', error);
    return NextResponse.json(
      { code: 500, msg: '代码生成失败' },
      { status: 500 }
    );
  }
}
