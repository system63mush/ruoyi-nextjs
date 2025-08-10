import { NextRequest, NextResponse } from 'next/server';

// 模拟定时任务数据
const mockJobs = [
  {
    id: '1',
    jobName: '系统日志清理',
    jobGroup: 'DEFAULT',
    invokeTarget: 'logTask.cleanLog',
    cronExpression: '0 0 2 * * ?',
    misfirePolicy: '1',
    concurrent: '1',
    status: '0',
    createTime: '2024-01-01 00:00:00',
    nextValidTime: '2024-01-02 02:00:00'
  },
  {
    id: '2',
    jobName: '数据备份',
    jobGroup: 'DEFAULT',
    invokeTarget: 'backupTask.backup',
    cronExpression: '0 0 1 * * ?',
    misfirePolicy: '1',
    concurrent: '1',
    status: '0',
    createTime: '2024-01-01 00:00:00',
    nextValidTime: '2024-01-02 01:00:00'
  }
];

// 获取定时任务列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobName = searchParams.get('jobName');
    const jobGroup = searchParams.get('jobGroup');
    const status = searchParams.get('status');

    let filteredJobs = mockJobs;
    
    if (jobName) {
      filteredJobs = filteredJobs.filter(job => 
        job.jobName.includes(jobName)
      );
    }
    
    if (jobGroup) {
      filteredJobs = filteredJobs.filter(job => 
        job.jobGroup === jobGroup
      );
    }
    
    if (status) {
      filteredJobs = filteredJobs.filter(job => 
        job.status === status
      );
    }

    return NextResponse.json({
      code: 200,
      msg: '操作成功',
      rows: filteredJobs,
      total: filteredJobs.length
    });
  } catch (error) {
    console.error('获取定时任务列表失败:', error);
    return NextResponse.json(
      { code: 500, msg: '获取定时任务列表失败' },
      { status: 500 }
    );
  }
}

// 创建定时任务
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newJob = {
      ...body,
      id: Date.now().toString(),
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      nextValidTime: new Date(Date.now() + 86400000).toISOString().replace('T', ' ').substring(0, 19)
    };

    return NextResponse.json({
      code: 200,
      msg: '创建成功',
      data: newJob
    });
  } catch (error) {
    console.error('创建定时任务失败:', error);
    return NextResponse.json(
      { code: 500, msg: '创建定时任务失败' },
      { status: 500 }
    );
  }
}

// 更新定时任务
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    return NextResponse.json({
      code: 200,
      msg: '更新成功'
    });
  } catch (error) {
    console.error('更新定时任务失败:', error);
    return NextResponse.json(
      { code: 500, msg: '更新定时任务失败' },
      { status: 500 }
    );
  }
}

// 删除定时任务
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { code: 400, msg: '任务ID不能为空' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      code: 200,
      msg: '删除成功'
    });
  } catch (error) {
    console.error('删除定时任务失败:', error);
    return NextResponse.json(
      { code: 500, msg: '删除定时任务失败' },
      { status: 500 }
    );
  }
}
