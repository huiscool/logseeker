
import * as ls from '../../logset';


// 测试用例
export function TestLogSetOK() {

    let set = new ls.LogSet("test");

    let srcid = set.createAndAddLogSource("./test.txt");
    
    set.delLogSource(srcid);

}