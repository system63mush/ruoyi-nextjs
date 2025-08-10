import { NextRequest, NextResponse } from 'next/server';

// 模拟表单数据
const mockForms = [
  {
    id: '1',
    formName: '用户注册表单',
    formContent: '{"fields":[{"type":"input","label":"用户名","name":"username"},{"type":"password","label":"密码","name":"password"}]}',
    status: '0',
    createTime: '2024-01-01 00:00:00'
  },
  {
    id: '2',
    formName: '产品信息表单',
    formContent: '{"fields":[{"type":"input","label":"产品名称","name":"productName"},{"type":"textarea","label":"产品描述","name":"description"}]}',
    status: '0',
    createTime: '2024-01-01 00:00:00'
  }
];

// 获取表单列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const formName = searchParams.get('formName');
    const status = searchParams.get('status');

    let filteredForms = mockForms;
    
    if (formName) {
      filteredForms = filteredForms.filter(form => 
        form.formName.includes(formName)
      );
    }
    
    if (status) {
      filteredForms = filteredForms.filter(form => 
        form.status === status
      );
    }

    return NextResponse.json({
      code: 200,
      msg: '操作成功',
      rows: filteredForms,
      total: filteredForms.length
    });
  } catch (error) {
    console.error('获取表单列表失败:', error);
    return NextResponse.json(
      { code: 500, msg: '获取表单列表失败' },
      { status: 500 }
    );
  }
}

// 创建表单
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newForm = {
      ...body,
      id: Date.now().toString(),
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    return NextResponse.json({
      code: 200,
      msg: '创建成功',
      data: newForm
    });
  } catch (error) {
    console.error('创建表单失败:', error);
    return NextResponse.json(
      { code: 500, msg: '创建表单失败' },
      { status: 500 }
    );
  }
}

// 更新表单
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    return NextResponse.json({
      code: 200,
      msg: '更新成功'
    });
  } catch (error) {
    console.error('更新表单失败:', error);
    return NextResponse.json(
      { code: 500, msg: '更新表单失败' },
      { status: 500 }
    );
  }
}

// 删除表单
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { code: 400, msg: '表单ID不能为空' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      code: 200,
      msg: '删除成功'
    });
  } catch (error) {
    console.error('删除表单失败:', error);
    return NextResponse.json(
      { code: 500, msg: '删除表单失败' },
      { status: 500 }
    );
  }
}
