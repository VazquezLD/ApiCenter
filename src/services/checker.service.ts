import prisma from "../config/db.js";
import cron from "node-cron";

export const startUptimeChecker = () => {
    cron.schedule("0,30 * * * *", async () => {
        console.log("⏱️ [CRON] Iniciando monitoreo...");
        
        try {
            const projects = await prisma.project.findMany();

            for (const project of projects) {
                const startTime = Date.now();
                let isOnline = false;
                let statusCode = 0;

                try {
                    const url = project.baseUrl.startsWith('http') 
                                ? project.baseUrl 
                                : `https://${project.baseUrl}`;

                    const response = await fetch(url, { 
                        method: project.method,
                        signal: AbortSignal.timeout(10000) 
                    });

                    statusCode = response.status;
                    isOnline = response.ok;
                } catch (err) {
                    isOnline = false;
                    statusCode = 0; // 0 indica error de conexión o timeout
                }

                const responseTime = Date.now() - startTime;
                await prisma.$transaction([
                    prisma.project.update({
                        where: { id: project.id },
                        data: {
                            lastStatus: isOnline ? "ONLINE" : "OFFLINE",
                        }
                    }),
                    prisma.log.create({
                        data: {
                            statusCode,
                            responseTime,
                            isOnline,
                            projectId: project.id
                        }
                    })
                ]);

                console.log(`📡 ${isOnline ? '✅' : '❌'} ${project.name} - Status: ${statusCode} (${responseTime}ms)`);
            }
        } catch (error) {
            console.error("❌ Error en el cron job:", error);
        }
    });
};