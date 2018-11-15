import { Component, OnInit } from '@angular/core';
import { DiffyService }      from '../diffy.service';
import { SharedDiff }        from '../SharedDiff';
import { ActivatedRoute }    from '@angular/router';
import { FileTree }          from '../diff-detail/tree-functions';
import { printerUtils }      from '../diff-detail/printer-utils.js';

@Component({
    selector: 'app-diff-detail',
    templateUrl: './diff-detail.component.html',
    styleUrls: ['./diff-detail.component.css']
})
export class DiffDetailComponent implements OnInit {

    loading        : boolean;
    sharedDiff     : SharedDiff;
    fileTree       : FileTree;
    fileSelectorFn : (fileId: string) => void;
    selectedFileId : string;

    constructor(
        private route: ActivatedRoute,
        private diffyService: DiffyService
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        this.loading = true;
        this.diffyService.getDiff(id)
            .subscribe(diffy => {
                this.sharedDiff = diffy
                this.loading = false;
            });
    }

    private getFileName(file) {
        return file.newName == '/dev/null' ? file.oldName : file.newName;
    };

    getFileSelectorFn() {
        if(!this.fileSelectorFn) {
            this.fileSelectorFn = (fileId:string) => {
                this.selectedFileId = fileId;
            }
        }
        return this.fileSelectorFn;
    }

    getFileTree(): FileTree {
        if(!this.fileTree) {
            let tree = new FileTree();
            this.sharedDiff.diff.forEach(e => {
                tree.insert(this.getFileName(e), e);
            });
            this.fileTree = tree;
        }
        return this.fileTree;
    }

    getFileCount(): number {
        return 0;
    }
}