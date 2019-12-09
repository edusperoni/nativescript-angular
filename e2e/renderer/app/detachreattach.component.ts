import { Component, OnInit, ViewChild, ViewContainerRef, TemplateRef, ViewRef, EmbeddedViewRef } from "@angular/core";
import { Label } from "tns-core-modules/ui/label";

// let labelsCreated = 0;

// const oldCreateView = Label.prototype.createNativeView;

// Label.prototype.createNativeView = function () {
//     labelsCreated++;
//     console.log("LabelCreateNativeView: create native view " + labelsCreated);
//     return oldCreateView.apply(this, arguments);
// }

interface ItemContext {
    $implicit: {
        text: string;
    }
}

@Component({
    selector: "Home",
    moduleId: module.id,
    template: `
    <GridLayout>
        <ScrollView class="page">
            <StackLayout class="home-panel">
                <!--Add your page content here-->
                <Button text="create views" (tap)="createViews()"></Button>
                <Button text="remove views" (tap)="removeViews()"></Button>
                <Button text="move views" (tap)="moveViews()"></Button>
                <StackLayout backgroundColor="green">
                    <ng-container #greenvc> </ng-container>
                </StackLayout>
                <StackLayout backgroundColor="red">
                    <ng-container #redvc></ng-container>
                </StackLayout>
                <ng-template #labelTemplate let-item>
                    <Label [text]="item.text"></Label>
                </ng-template>
            </StackLayout>
        </ScrollView>
    </GridLayout>
`, styles: []
})
export class DetachReattachComponent implements OnInit {
    @ViewChild("labelTemplate", { static: false }) labelTemplate: TemplateRef<ItemContext>;
    @ViewChild("greenvc", { read: ViewContainerRef, static: false }) greenvc: ViewContainerRef;
    @ViewChild("redvc", { read: ViewContainerRef, static: false }) redvc: ViewContainerRef;
    greenViews: ViewRef[] = [];
    redViews: ViewRef[] = [];

    constructor() {
    }

    ngOnInit(): void {
    }

    createViews() {
        this.greenViews.push(this.greenvc.createEmbeddedView(this.labelTemplate, { $implicit: { text: "green" } }));
        this.redViews.push(this.redvc.createEmbeddedView(this.labelTemplate, { $implicit: { text: "red" } }));
    }

    moveViews() {
        if (this.greenViews.length == 0) { return; }
        // console.log(this.greenViews, this.redViews);
        const greenView = this.greenvc.detach(this.greenvc.indexOf(this.greenViews[0])) as EmbeddedViewRef<ItemContext>;
        this.greenViews.shift()
        greenView.context.$implicit.text = greenView.context.$implicit.text + ">red";
        const redView = this.redvc.detach(this.redvc.indexOf(this.redViews[0])) as EmbeddedViewRef<ItemContext>;
        this.redViews.shift();
        redView.context.$implicit.text = redView.context.$implicit.text + ">green";
        this.greenViews.push(this.greenvc.insert(redView));
        this.redViews.push(this.redvc.insert(greenView));
    }

    removeViews() {
        if (this.greenViews.length == 0) { return; }
        this.greenvc.remove(this.greenvc.indexOf(this.greenViews[0]));
        this.greenViews.shift();
        this.redvc.remove(this.redvc.indexOf(this.redViews[0]));
        this.redViews.shift();
    }
}
