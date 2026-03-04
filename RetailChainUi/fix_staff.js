const fs = require("fs"); 
const file = "src/pages/StoreDashboard/components/StoreStaffWidget.jsx"; 
let content = fs.readFileSync(file, "utf8");

// Fix staff array default check
content = content.replace(/const staffList = staff \|\| \[[^\]]*\];/s, "const staffList = staff && staff.length > 0 ? staff : [];");

// Add array wrapper map 
const targetFragment = "{staffList.slice(0, 5).map((person, index) => (";
const newFragment = `{staffList.length > 0 ? (
                            staffList.slice(0, 5).map((person, index) => (`;
content = content.replace(targetFragment, newFragment);

// Add empty table row handler 
const endTarget = "                    </TableBody>";
const endNew = `                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-4 text-slate-500">
                                    No staff data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>`;
content = content.replace(endTarget, endNew);

fs.writeFileSync(file, content);
