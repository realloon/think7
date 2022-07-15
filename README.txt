Version_0.0.1：
    添加基础指令；

Version_0.0.2：
    添加命令：echo、date、data；
    封装内置指令，优化输入命令执行流程；
    使用上方向键填充上一条输入的命令，本地浏览器储存；
    封装基础数据，加密储存于本地浏览器；
    添加终端的错误警告；

Version_0.0.3：
    添加命令：bmi、history；
    重构数据库，并重构data命令，重命名为database命令；
    将对象字面量重构为单例类，包括Think7Tools、Database和Think7Terminal类；
    重构解析器函数，支持参数解析；
    翻译命令支持中英互译和整句翻译，使用anxio+jsonp；
    重构时间工具库；
    重构清屏指令；

Version_0.0.4：
    添加命令：bmr；
    重构时间工具库及相关引用，使用Map数据结构；